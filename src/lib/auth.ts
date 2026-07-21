import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

/**
 * Better Auth server instance. Email + password with the Prisma adapter.
 * The `role` field is surfaced on the session so RBAC checks can read it.
 */
export const auth = betterAuth({
  appName: "Lumina",
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 10,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "VIEWER", input: false },
      jobTitle: { type: "string", required: false },
      phone: { type: "string", required: false },
      isActive: { type: "boolean", defaultValue: true, input: false },
    },
  },
  advanced: {
    cookiePrefix: "lumina",
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
