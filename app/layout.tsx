import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "TRPC, Tanstacl Query, Next Auth, Prisma, Zod, and TailwindCSS Starter",
  description:
    "A starter template for building fullstack applications with TRPC, Tanstacl Query, Next Auth, Prisma, Zod, and TailwindCSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
