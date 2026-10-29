import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zandriebarraba.1305@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Admin Credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: ADMIN_EMAIL },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;

      if (!email || !password) {
        return null;
      }

      const expectedEmail = (process.env.ADMIN_EMAIL || "zandriebarraba.1305@gmail.com").trim().toLowerCase();
      const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (email === expectedEmail && password === expectedPassword) {
        return {
          id: "admin-z-andrie",
          name: "Z Andrie",
          email: expectedEmail,
        };
      }

      return null;
    },
  }),
];

// Conditionally enable GitHub OAuth Provider only when credentials are provided
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "z-andrie-admin-secure-session-secret-2026-auth",
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = (process.env.ADMIN_EMAIL || "zandriebarraba.1305@gmail.com").trim().toLowerCase();
      if (user.email && user.email.trim().toLowerCase() === allowedEmail) {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
