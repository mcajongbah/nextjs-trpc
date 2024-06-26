import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../../server/api";
import { createTRPCContext } from "../../../../../server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      return await createTRPCContext({ headers: req.headers });
    },
  });

export { handler as GET, handler as POST };
