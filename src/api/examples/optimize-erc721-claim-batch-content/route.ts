import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import addresses from "./unoptimized.json";

const optimizeERC721DropClaimContent = new OpenAPIHono();
const get = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: z.object({
            data: z.object({
              originalLength: z.number().int(),
              optimizedLength: z.number().int(),
              totalToAirdrop: z.number().int(),
            }),
          }),
        },
      },
    },
  },
});

optimizeERC721DropClaimContent.openapi(get, (c) => {
  const results: Array<{ address: string; quantity: number }> = [];
  addresses.forEach((item, index) => {
    const previousItem = results.at(-1);
    if (
      index > 0 &&
      previousItem &&
      item.toLowerCase() === previousItem.address.toLowerCase()
    ) {
      results[results.length - 1] = {
        address: item.toLowerCase(),
        quantity: 1 + previousItem.quantity,
      };
    } else {
      results.push({
        address: item.toLowerCase(),
        quantity: 1,
      });
    }
  });
  const jsonData = JSON.stringify(results, null, 2);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "optimized.json");
  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Successfully wrote to optimized.json");
    }
  });

  return c.json({
    data: {
      originalLength: addresses.length,
      optimizedLength: results.length,
      totalToAirdrop: results.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
});

export default optimizeERC721DropClaimContent;
