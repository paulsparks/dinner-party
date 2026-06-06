import { Pool } from "pg";

export const pgConnectionString = process.env.DATABASE_URL;

export const pgPool = new Pool({
    connectionString: pgConnectionString,
});
