import type { AuthType } from "@zenstackhq/orm";
import { RPCApiHandler } from "@zenstackhq/server/api";
import { NextRequestHandler } from "@zenstackhq/server/next";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { type SchemaType, schema } from "~/zenstack/schema";

const handler = NextRequestHandler({
    apiHandler: new RPCApiHandler({ schema }),
    getClient: async (req: NextRequest) => {
        const session = await auth.api.getSession(req);

        if (session) {
            const userContext: AuthType<SchemaType> = {
                ...session.user,
                sessions: [session.session],
            };

            return db.$setAuth(userContext);
        } else {
            return db;
        }
    },
    useAppDir: true,
});

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
};
