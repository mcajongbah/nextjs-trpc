import { createTRPCRouter } from "../trpc";
import { authRouter } from "./routers/authRouter";

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
