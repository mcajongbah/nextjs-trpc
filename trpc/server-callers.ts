import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/trpc';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

export const createCaller = async () => {
    const ctx = await createTRPCContext({ headers: new Headers() });
    return createServerSideHelpers({
      router: appRouter,
      ctx,
      transformer: superjson,
    });
  };