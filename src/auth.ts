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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Reddit],
  callbacks: {
    session({ session }) {
      const jwt = createJWT(session.user.name);
      return {
        ...session,
        jwt,
      };
    },
  },
});

// extend the built-in session type
declare module "next-auth" {
  interface Session {
    jwt?: string;
  }
}
