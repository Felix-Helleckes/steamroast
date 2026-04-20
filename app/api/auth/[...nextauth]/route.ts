import NextAuth from "next-auth";
import SteamProvider from "next-auth-steam";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    SteamProvider({
      clientSecret: process.env.STEAM_API_KEY!,
      returnURL: process.env.NEXTAUTH_URL + "/api/auth/callback/steam",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "steam" && account?.providerAccountId) {
        token.steamId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.steamId) {
        session.user.steamId = token.steamId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
