import NextAuth from "next-auth";
import Reddit from "next-auth/providers/reddit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Reddit],
});
