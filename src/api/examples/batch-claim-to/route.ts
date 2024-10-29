import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { timeout } from "hono/timeout";
import { getContract, sendAndConfirmTransaction } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo, claimToBatch } from "thirdweb/extensions/erc721";
import { privateKeyToAccount } from "thirdweb/wallets";
import { getEnv } from "../../../lib/env.js";
import { thirdwebClient } from "../../../lib/thirdweb-client.js";
import { sleep } from "../../../lib/utils.js";
import all_claims from "./all_batch.json";

const erc721BatchClaimTo = new OpenAPIHono();
erc721BatchClaimTo.use("/", timeout(300_000));

const get = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: z.object({
            data: z.any(),
          }),
        },
      },
    },
  },
});

erc721BatchClaimTo.openapi(get, async (c) => {
  const contract = getContract({
    address: "0x4A0CDD254F3CD129f8916e9f2beE2270907c3FFc",
    chain: sepolia,
    client: thirdwebClient,
  });
  const account = privateKeyToAccount({
    privateKey: getEnv("PRIVATE_KEY"),
    client: thirdwebClient,
  });
  const txReceipts: string[] = [];
  for (let i = 0; i < all_claims.length; i++) {
    if (i < 445) continue;
    try {
      console.log(`claiming index ${i}`);
      const transaction = claimTo({
        from: account.address,
        to: all_claims[i].address,
        quantity: BigInt(all_claims[i].quantity),
        contract,
      });
      const receipt = await sendAndConfirmTransaction({
        transaction,
        account,
      });
      console.log(receipt.transactionHash);
      txReceipts.push(receipt.transactionHash);
      await sleep(500);
    } catch (err) {
      console.log(`Mint failed at index: ${i}`);
      console.log(all_claims[i]);
      break;
    }
  }
  return c.json({ data: txReceipts });
});

export default erc721BatchClaimTo;
