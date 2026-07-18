import { zenstackAdapter } from "@zenstackhq/better-auth";
import { betterAuth } from "better-auth";
import { db } from "./db";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: zenstackAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: ["User", "Admin"],
                defaultValue: "User",
                input: false,
            },
            approved: {
                type: "boolean",
                defaultValue: false,
                input: false,
            },
        },
    },
});
