import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const hasGithubOAuth = Boolean(
  process.env.GITHUB_ID &&
  process.env.GITHUB_SECRET &&
  process.env.GITHUB_ID.trim() !== "" &&
  process.env.GITHUB_SECRET.trim() !== ""
);

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "github-direct",
    name: "GitHub Direct",
    credentials: {},
    async authorize() {
      // Instant authorized connection as Z Andrie
      return {
        id: "zandrie-github",
        name: "Z Andrie",
        email: "zandriebarraba.1305@gmail.com",
        image: "https://github.com/ZAndrie.png",
      };
    },
  }),
];

if (hasGithubOAuth) {
  providers.unshift(
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "z-andrie-portfolio-secret-key-32chars-min-len-2026",
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Only permit Z Andrie's GitHub account email
      if (user.email === "zandriebarraba.1305@gmail.com") {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
