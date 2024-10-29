import { Redis } from "ioredis";
import { getEnv } from "../env.js";

export const redis = new Redis(getEnv("REDIS_URL"));
