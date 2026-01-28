import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { logLogin } from "./logger";

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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const ip = req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || "0.0.0.0";

        // หา user ด้วย Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          await logLogin({ email: credentials.email, status: "Failure - User not found", ip });
          return null;
        }

        // ตรวจสอบ password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          await logLogin({ email: user.email, status: "Failure - Invalid password", ip });
          return null;
        }

        await logLogin({ email: user.email, status: "Success", ip });

        return {
          id: user.id,
          name: user.name,
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
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
