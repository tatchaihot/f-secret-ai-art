import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
        if (!hashedPassword) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          hashedPassword
        );

        if (isValid) {
          return { id: "admin", name: "Admin", email: "admin@fsecretai.art" };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
