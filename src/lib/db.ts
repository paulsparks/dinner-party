import { type ClientContract, ZenStackClient } from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { PolicyPlugin } from "@zenstackhq/plugin-policy";
import { Pool } from "pg";
import { type SchemaType, schema } from "~/zenstack/schema";

export const db: ClientContract<SchemaType> = new ZenStackClient(schema, {
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

            if (party.guests.some((g) => g.userId === client.$auth?.id)) {
                throw new Error(
                    "You've already reserved a seat for this party",
                );
            }

            if (party.guests.length >= party.maxGuests) {
                throw new Error("Party already has the max amount of guests");
            }

            return db.dinnerPartyGuest.create({
                data: {
                    partyId: args.partyId,
                    userId: client.$auth.id,
                },
            });
        },
        getGuestCount: async ({ client, args }) => {
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

            const count: number = party.guests.length;

            return count;
        },
        unReserveSeat: async ({ client, args }) => {
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

            if (!party.guests.some((g) => g.userId === client.$auth?.id)) {
                throw new Error("You have not reserved a seat for this party");
            }

            await db.dinnerPartyGuest.delete({
                where: {
                    partyId_userId: {
                        partyId: args.partyId,
                        userId: client.$auth.id,
                    },
                },
            });
        },
        tryAccessCode: async ({ client, args }) => {
            const userId = client.$auth?.id;

            if (!userId) {
                throw new Error("Unauthorized");
            }

            const codeWorks = !!(await db.accessCode.findUnique({
                where: { code: args.accessCode },
            }));

            if (codeWorks) {
                await db.$transaction([
                    db.user.update({
                        where: { id: userId },
                        data: { approved: true },
                    }),
                    db.accessCode.delete({ where: { code: args.accessCode } }),
                ]);
            }

            return codeWorks;
        },
    },
});

export const dbWithAuth = db.$use(new PolicyPlugin());
