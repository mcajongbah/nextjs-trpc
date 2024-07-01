// src/server/middlewares/rateLimiter.ts
import { TRPCError } from '@trpc/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export const rateLimiter = async (opts: { identifier: string }) => {
  const { identifier } = opts;
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.',
    });
  }
};