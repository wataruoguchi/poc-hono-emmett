import { defineConfig } from "kysely-ctl";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { postgresOptions } from "../src/datastore/db.ts";

const dialect = new PostgresJSDialect({
  postgres: postgres({
    ...postgresOptions,
  }),
});

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "db/migrations",
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});

/**
 * kysely migrate:make
 * kysely migrate:up
 * kysely migrate:down
 */
