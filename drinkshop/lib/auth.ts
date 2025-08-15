import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { publicApi } from "./api/axios";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Credentials Provider (existing email/password login)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call your existing login API
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const result = await response.json();

          if (response.ok && result.success && result.data) {
            return {
              id: result.data.id,
              email: result.data.email,
              name: `${result.data.firstName} ${result.data.lastName}`,
              role: result.data.role,
              image: result.data.avatar,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists in database
          const response = await publicApi.get("/users");
          const existingUsers = response.data || response; // Handle axios interceptor
          const existingUser = Array.isArray(existingUsers)
            ? existingUsers.find((u: any) => u.email === user.email)
            : null;

          if (!existingUser) {
            // Create new user for OAuth
            const newUser = {
              email: user.email,
              password: "oauth-user", // OAuth users don't need password
              firstName: user.name?.split(" ")[0] || "OAuth",
              lastName: user.name?.split(" ").slice(1).join(" ") || "User",
              avatar: user.image || "placeholder/avatar.png",
              role: "customer",
              receiveNews: false,
              twoFactorEnabled: false,
            };

            await publicApi.post("/users", newUser);
          }

          return true;
        } catch (error) {
          console.error("OAuth sign in error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "customer";
        token.id = user.id;
      }

      // For OAuth users, fetch user data from database
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const response = await publicApi.get("/users");
          const existingUsers = response.data || response;
          const dbUser = Array.isArray(existingUsers)
            ? existingUsers.find((u: any) => u.email === token.email)
            : null;

          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
};
