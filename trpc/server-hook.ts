import { appRouter } from "@/server/api";
import { createCaller } from "./server-callers";

export function useServerTrpc() {
  return createCaller();
}
