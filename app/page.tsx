"use client";

import { trpc } from "@/trpc/client";

export default function Home() {
  const { data, isLoading } = trpc.auth.sayHello.useQuery(
    {
      email: "mail@example.com",
      password: "password",
    },
    { refetchOnMount: false, refetchOnReconnect: false }
  );

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <h1>{data}</h1>
    </div>
  );
}
