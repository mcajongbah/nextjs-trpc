import "server-only"

import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "@/server/trpc";
import { createCaller } from "@/server/api";


const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const serverClient = createCaller(await createContext());
