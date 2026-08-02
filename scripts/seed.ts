/**
 * Wipes local dinner-party data and repopulates it with realistic fixtures
 * for manual testing and development. Refuses to run against a non-local
 * DATABASE_URL unless FORCE_SEED=true is set.
 *
 * Usage: pnpm-s run seed
 */
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const SEED_PASSWORD = "Password123!";

const databaseUrl = process.env.DATABASE_URL ?? "";
const looksLocal = /localhost|127\.0\.0\.1/.test(databaseUrl);
if (!looksLocal && process.env.FORCE_SEED !== "true") {
    console.error(
        `Refusing to seed: DATABASE_URL does not look local (${databaseUrl}).\n` +
            "Set FORCE_SEED=true to override.",
    );
    process.exit(1);
}

type SeedUser = {
    name: string;
    email: string;
    role: "User" | "Admin";
    approved: boolean;
};

const seedUsers: SeedUser[] = [
    {
        name: "Alice Nguyen",
        email: "alice.nguyen@example.com",
        role: "Admin",
        approved: true,
    },
    {
        name: "Ben Carter",
        email: "ben.carter@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Marcus Webb",
        email: "marcus.webb@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Sofia Torres",
        email: "sofia.torres@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Jamal Green",
        email: "jamal.green@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Elena Petrova",
        email: "elena.petrova@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Tom O'Reilly",
        email: "tom.oreilly@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Grace Kim",
        email: "grace.kim@example.com",
        role: "User",
        approved: true,
    },
    {
        name: "Diego Ramirez",
        email: "diego.ramirez@example.com",
        role: "User",
        approved: false,
    },
];

type SeedParty = {
    title: string;
    description: string;
    dateTime: Date;
    maxGuests: number;
    guestEmails: string[];
};

const seedParties: SeedParty[] = [
    {
        title: "Midsummer Supper Club",
        description:
            "A relaxed evening of grilled vegetables, chilled rosé, and stories from everyone's summer so far.",
        dateTime: new Date("2026-07-12T19:00:00"),
        maxGuests: 8,
        guestEmails: [
            "alice.nguyen@example.com",
            "ben.carter@example.com",
            "priya.patel@example.com",
            "sofia.torres@example.com",
        ],
    },
    {
        title: "Late Summer Backyard BBQ",
        description:
            "Burgers, corn on the cob, and a firepit for dessert s'mores. Bring a side dish if you're feeling ambitious.",
        dateTime: new Date("2026-08-16T17:00:00"),
        maxGuests: 10,
        guestEmails: [
            "ben.carter@example.com",
            "marcus.webb@example.com",
            "jamal.green@example.com",
            "grace.kim@example.com",
        ],
    },
    {
        title: "Wine & Cheese Evening",
        description:
            "A casual tasting flight of five wines paired with cheeses from the farmers market. Come hungry.",
        dateTime: new Date("2026-08-29T19:30:00"),
        maxGuests: 6,
        guestEmails: ["alice.nguyen@example.com", "elena.petrova@example.com"],
    },
    {
        title: "Harvest Potluck Dinner",
        description:
            "Everyone brings a dish inspired by their favorite fall ingredient. Vegetarian and gluten-free options welcome.",
        dateTime: new Date("2026-09-20T18:00:00"),
        maxGuests: 12,
        guestEmails: [
            "priya.patel@example.com",
            "sofia.torres@example.com",
            "tom.oreilly@example.com",
            "grace.kim@example.com",
        ],
    },
    {
        title: "Cozy Autumn Roast",
        description:
            "A slow-roasted chicken dinner with all the trimmings, served family-style around the big table.",
        dateTime: new Date("2026-10-18T18:30:00"),
        maxGuests: 8,
        guestEmails: ["marcus.webb@example.com", "jamal.green@example.com"],
    },
    {
        title: "Friendsgiving Feast",
        description:
            "Our annual pre-Thanksgiving gathering. Turkey and stuffing provided, everything else is a potluck free-for-all.",
        dateTime: new Date("2026-11-21T17:00:00"),
        maxGuests: 15,
        guestEmails: [
            "alice.nguyen@example.com",
            "ben.carter@example.com",
            "priya.patel@example.com",
            "elena.petrova@example.com",
            "tom.oreilly@example.com",
        ],
    },
    {
        title: "New Year's Eve Dinner Party",
        description:
            "A dressed-up multi-course dinner to ring in the new year, with a champagne toast at midnight.",
        dateTime: new Date("2026-12-31T20:00:00"),
        maxGuests: 20,
        guestEmails: [
            "alice.nguyen@example.com",
            "sofia.torres@example.com",
            "grace.kim@example.com",
        ],
    },
];

type SeedComment = {
    partyTitle: string;
    authorEmail: string;
    content: string;
    replies?: { authorEmail: string; content: string }[];
};

const seedComments: SeedComment[] = [
    {
        partyTitle: "Midsummer Supper Club",
        authorEmail: "ben.carter@example.com",
        content:
            "That rosé Alice brought last time was amazing, hope she's bringing it again!",
        replies: [
            {
                authorEmail: "alice.nguyen@example.com",
                content: "Already chilling in the fridge, don't worry.",
            },
        ],
    },
    {
        partyTitle: "Harvest Potluck Dinner",
        authorEmail: "sofia.torres@example.com",
        content:
            "I'll bring a butternut squash gratin, let me know if anyone has nut allergies.",
    },
    {
        partyTitle: "Friendsgiving Feast",
        authorEmail: "tom.oreilly@example.com",
        content:
            "Should we do a dessert sign-up sheet so we don't end up with five pumpkin pies again?",
        replies: [
            {
                authorEmail: "priya.patel@example.com",
                content: "Please, yes. I'm still recovering from last year.",
            },
            {
                authorEmail: "elena.petrova@example.com",
                content: "I've got apple crumble covered either way.",
            },
        ],
    },
];

async function main() {
    console.log("Wiping existing dinner party data...");
    await db.dinnerParty.deleteMany();
    await db.accessCode.deleteMany();
    await db.user.deleteMany();

    console.log("Creating users...");
    const userIdByEmail = new Map<string, string>();
    for (const seedUser of seedUsers) {
        const { user } = await auth.api.signUpEmail({
            body: {
                name: seedUser.name,
                email: seedUser.email,
                password: SEED_PASSWORD,
            },
        });
        await db.user.update({
            where: { id: user.id },
            data: { role: seedUser.role, approved: seedUser.approved },
        });
        userIdByEmail.set(seedUser.email, user.id);
    }

    console.log("Creating dinner parties...");
    const partyIdByTitle = new Map<string, number>();
    for (const seedParty of seedParties) {
        const party = await db.dinnerParty.create({
            data: {
                title: seedParty.title,
                description: seedParty.description,
                dateTime: seedParty.dateTime,
                maxGuests: seedParty.maxGuests,
            },
        });
        partyIdByTitle.set(seedParty.title, party.id);

        for (const guestEmail of seedParty.guestEmails) {
            const userId = userIdByEmail.get(guestEmail);
            if (!userId) continue;
            await db.dinnerPartyGuest.create({
                data: { partyId: party.id, userId },
            });
        }
    }

    console.log("Creating comments...");
    for (const seedComment of seedComments) {
        const partyId = partyIdByTitle.get(seedComment.partyTitle);
        const authorId = userIdByEmail.get(seedComment.authorEmail);
        const authorSeed = seedUsers.find(
            (u) => u.email === seedComment.authorEmail,
        );
        if (!partyId || !authorId || !authorSeed) continue;

        const comment = await db.comment.create({
            data: {
                partyId,
                authorId,
                authorName: authorSeed.name,
                content: seedComment.content,
            },
        });

        for (const reply of seedComment.replies ?? []) {
            const replyAuthorId = userIdByEmail.get(reply.authorEmail);
            const replyAuthorSeed = seedUsers.find(
                (u) => u.email === reply.authorEmail,
            );
            if (!replyAuthorId || !replyAuthorSeed) continue;

            await db.comment.create({
                data: {
                    partyId,
                    authorId: replyAuthorId,
                    authorName: replyAuthorSeed.name,
                    content: reply.content,
                    parentId: comment.id,
                },
            });
        }
    }

    console.log("Creating access codes...");
    const accessCodes = await Promise.all([
        db.accessCode.create({ data: {} }),
        db.accessCode.create({ data: {} }),
        db.accessCode.create({ data: {} }),
    ]);

    console.log("\nSeed complete.");
    console.log(
        `  ${seedUsers.length} users created, password for all: ${SEED_PASSWORD}`,
    );
    console.log(
        `  Admin login: ${seedUsers.find((u) => u.role === "Admin")?.email}`,
    );
    console.log(
        `  Unapproved login (for testing access codes): ${seedUsers.find((u) => !u.approved)?.email}`,
    );
    console.log(`  ${seedParties.length} dinner parties created`);
    console.log(
        `  Unused access codes: ${accessCodes.map((c) => c.code).join(", ")}`,
    );
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.$disconnect();
    });
