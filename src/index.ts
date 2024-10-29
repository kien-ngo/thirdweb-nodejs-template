// load the env variables from the .env file
import dotenv from "dotenv";
dotenv.config();

// should come before any other API code so it can inject its things
import "./lib/datadog.js";

import { serve } from "@hono/node-server";
import app from "./app.js";
import { applyMigrations } from "./db/apply-migrations.js";
import { defaultLogger } from "./lib/logger.js";

await applyMigrations();

const port = Number(process.env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port,
});

defaultLogger.info(`Server running on port ${port}`);
