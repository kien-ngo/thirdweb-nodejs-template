import { OpenAPIHono } from "@hono/zod-openapi";
import v1Routes from "./api/v1/routes.js";
import { defaultLogger } from "./lib/logger.js";
import { getRedisStatus } from "./lib/redis/health-check.js";
import { correlationId } from "./middleware/correlation-id.js";

const app = new OpenAPIHono();

// Add the correlationId middleware to all routes
app.use("*", correlationId);

app.get("/health", async (c) => {
  return c.json({
    redis: await getRedisStatus(),
    // service is OK if we reach this point
    status: "ok",
    correlationId: c.get("correlationId"),
  });
});

// v1 of the API
app.route("/v1", v1Routes);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "thirdweb service template",
    version: "1.0.0",
  },
});

// Error handling middleware
app.onError((err, c) => {
  const _correlationId = c.get("correlationId");
  defaultLogger.error("Internal server error", err, {
    correlationId: _correlationId,
    status: c.res.status,
    method: c.req.method,
    path: c.req.path,
  });
  return c.json(
    { error: "Internal Server Error", correlationId: _correlationId },
    500,
  );
});

export default app;
