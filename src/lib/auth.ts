import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            // First login: user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.picture = user.image; // Mapping standard NextAuth image
                return token;
            }

            // Subsequent requests: check DB to ensure data freshness (optional but recommended for roles)
            if (token.email) {
                const dbUser = await db.user.findUnique({
                    where: {
                        email: token.email,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        digitalSignature: true
                        // Note: We might want digitalSignature mapped to something else or just keep it unused for now if not needed in session
                    }
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.role = dbUser.role;
                    // token.picture = dbUser.digitalSignature; // Only if you want signature as avatar
                }
            }

            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
