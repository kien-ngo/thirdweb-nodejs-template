import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { getEnv } from "../lib/env.js";
import * as schema from "./schema.js";

const primaryDB = drizzle(
  new pg.Pool({
    connectionString: getEnv("DATABASE_URL"),
  }),
  { schema },
);

// TODO: set up read replica if needed
// https://orm.drizzle.team/docs/read-replicas

export const db = primaryDB;
