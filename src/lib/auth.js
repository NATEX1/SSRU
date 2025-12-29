import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // หา user ด้วย Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // ตรวจสอบ password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
