import NextAuth from "next-auth";
import Reddit from "next-auth/providers/reddit";
import { Session } from "next-auth";
import jwt from "jsonwebtoken";
import { toSecondsSinceEpoch } from "@/app/utils/format";

const ALGORITHM = "HS256";

const createJWT = (session: Session) => {
  if (!session.user?.name) return "";

  const payload = {
    username: session.user.name,
    exp: toSecondsSinceEpoch(session.expires),
  };

  return jwt.sign(payload, process.env.AUTH_SECRET!, { algorithm: ALGORITHM });
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Reddit],
  session: {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  callbacks: {
    session({ session }) {
      const jwt = createJWT(session);
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
