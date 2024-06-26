import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultSession["user"] {
    twoFactorEnabled?: boolean;
    twoFactorVerified: boolean;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}
