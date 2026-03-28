import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { syncUserToConvex } from "./lib/syncUserToConvex";

const googleIsConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: googleIsConfigured
    ? [
        GoogleProvider({
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await syncUserToConvex({
        name: user.name,
        email: user.email,
        image: user.image,
      });

      return true;
    },
  },
};
