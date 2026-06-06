import { betterAuth } from "better-auth";
import { additionalTables } from "./additionalTables";
import { pgPool } from "./db";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: pgPool,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [additionalTables()],
});
