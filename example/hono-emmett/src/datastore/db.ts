import { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { env } from "../env.ts";

export const postgresOptions = {
  database: env.PGDATABASE,
  host: env.PGHOST,
  max: 10,
  port: env.PGPORT,
  user: env.PGUSER,
  password: env.PGPASSWORD,
};

export function connectDb(databaseName = env.PGDATABASE) {
  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: postgres({ ...postgresOptions, database: databaseName }),
    }),
  });
}
const db = connectDb();

export function getDb() {
  return db;
}
