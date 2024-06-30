import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import superjson from "superjson";
import { rateLimiter } from "./middlewares/rate-limiter";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return {
    prisma,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  // transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(async ({ ctx, next }) => {
  await rateLimiter({
    identifier: ctx.headers.get("x-forwarded-for") || "unknown",
  });
  return next();
});

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure
  .use(enforceUserIsAuthed)
  .use(async ({ ctx, next }) => {
    await rateLimiter({
      identifier: ctx.headers.get("x-forwarded-for") || "unknown",
    });
    return next();
  });
