import { serverClient } from "@/trpc/server";

export default async function Home() {
  const data = await serverClient.auth.sayHello({
    email: "mail@example.com",
    password: "password",
  });

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <h1>{data}</h1>
    </div>
  );
}
