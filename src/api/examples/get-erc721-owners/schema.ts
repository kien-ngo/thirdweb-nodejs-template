import { z } from "@hono/zod-openapi";
import { isAddress } from "thirdweb/utils";

export const GetERC721OwnerRequestSchema = z.object({
  chainId: z
    .string()
    .regex(/^\d+$/, "Chain ID must be a string containing only digits")
    .transform((val) => Number.parseInt(val, 10))
    .refine(
      (val) => Number.isInteger(val) && val > 0,
      "Chain ID must be a positive integer",
    ),
  contractAddress: z.string().refine((value) => isAddress(value), {
    message: "Invalid EVM address",
  }),
});

export const GetERC721OwnerResponseSchema = z.object({
  owner: z.string(),
  tokenId: z.string().refine((value) => Number.isInteger(value), {
    message: "Invalid tokenId. Must be an integer (type string)",
  }),
});
