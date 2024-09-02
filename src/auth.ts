import NextAuth from "next-auth";
import Reddit from "next-auth/providers/reddit";
import type { NextAuthConfig } from "next-auth";
import jwt from "jsonwebtoken";

const ALGORITHM = "HS256";
const ACCESS_TOKEN_EXPIRE_MINUTES = 60;

const createJWT = (username: string | null | undefined) => {
  if (!username) return "";

  const expirationTime =
    Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRE_MINUTES * 60;

  const payload = {
    username,
    exp: expirationTime,
  };

  return jwt.sign(payload, process.env.AUTH_SECRET!, { algorithm: ALGORITHM });
};

export const config = {
  providers: [Reddit],
  callbacks: {
    async session({ session, token }) {
      const jwt = createJWT(session.user.name);
      // send properties to the client, like an access_token from a provider.
      return {
        ...session,
        accessToken: token.accessToken,
        jwt,
      };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);

// extend the built-in session type
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    jwt?: string;
  }
}
