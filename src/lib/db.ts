import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen/dist";
import { Pool } from "pg";

export const pgConnectionString = process.env.DATABASE_URL;

export const pgPool = new Pool({
    connectionString: pgConnectionString,
});

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: pgPool,
    }),
});
