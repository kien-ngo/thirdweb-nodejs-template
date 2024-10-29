import { initializeLogger } from "../logger.js";
import { redis } from "./connection.js";

const redisLogger = initializeLogger("redis");

export async function getRedisStatus() {
  try {
    // we do not care what this returns, we just want to see if the connection is working
    await redis.get("health_check");
    return "ok" as const;
  } catch (e) {
    redisLogger.error(e);
    return "error" as const;
  }
}
