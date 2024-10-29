import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import Redis from "ioredis-mock";
import { beforeAll, vi } from "vitest";
import * as schema from "../src/db/schema.js";

const db = drizzle(new PGlite(), { schema });
const redisMock = new Redis();

vi.mock(import("../src/lib/redis/connection.js"), async () => {
  return { redis: redisMock };
});

vi.mock("../src/db/connection.js", () => {
  return { db };
});

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
});
