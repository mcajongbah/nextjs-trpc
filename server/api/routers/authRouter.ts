import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  sayHello: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .query(({ input: { email, password }, ctx }) => {
      return `Hello ${email}! Your password is ${password}`;
    }),
});
