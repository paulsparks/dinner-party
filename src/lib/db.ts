import {
    type CrudReturnType,
    ZenStackClient,
    type ZenStackPromise,
} from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { PolicyPlugin } from "@zenstackhq/plugin-policy";
import { Pool } from "pg";
import { type SchemaType, schema } from "~/zenstack/schema";

export const db = new ZenStackClient(schema, {
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
    procedures: {
        reserveSeat: async ({ client, args }) => {
            if (!client.$auth?.id) {
                throw new Error("Unauthorized");
            }

            const party = await db.dinnerParty.findUnique({
                where: { id: args.partyId },
                include: {
                    guests: true,
                },
            });

            if (!party) {
                throw new Error("Specified party does not exist");
            }

            if (party.guests.length >= party.maxGuests) {
                throw new Error("Party already has the max amount of guests");
            }

            const query: ZenStackPromise<
                CrudReturnType<
                    SchemaType,
                    "DinnerPartyGuest",
                    "create",
                    { data: { userId: string; partyId: number } }
                >
            > = db.dinnerPartyGuest.create({
                data: {
                    userId: client.$auth.id,
                    partyId: args.partyId,
                },
            });

            return query;
        },
    },
});

export const dbWithAuth = db.$use(new PolicyPlugin());
