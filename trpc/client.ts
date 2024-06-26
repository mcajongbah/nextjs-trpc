import { AppRouter } from "@/server/api";
import { createTRPCReact } from "@trpc/react-query";


export const trpc = createTRPCReact<AppRouter>({});
