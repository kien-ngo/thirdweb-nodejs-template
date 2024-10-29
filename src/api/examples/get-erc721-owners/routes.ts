import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { defineChain, getContract } from "thirdweb";
import {
  isERC721,
  nextTokenIdToMint,
  ownerOf,
  startTokenId,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { string, z } from "zod";
import { thirdwebClient } from "../../../lib/thirdweb-client.js";
import { handleRequestLimit } from "../../../lib/throttler.js";
import {
  GetERC721OwnerRequestSchema,
  GetERC721OwnerResponseSchema,
} from "./schema.js";

const erc721Owners = new OpenAPIHono();

const get = createRoute({
  method: "get",
  path: "/",
  request: {
    query: GetERC721OwnerRequestSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(z.string()),
          // schema: z.object({
          //   data: z.array(GetERC721OwnerResponseSchema),
          // }),
        },
      },
      description: "Success",
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

erc721Owners.openapi(get, async (c) => {
  const { contractAddress, chainId } = c.req.valid("query");
  const contract = getContract({
    address: contractAddress,
    chain: defineChain(chainId),
    client: thirdwebClient,
  });
  const _isERC721 = await isERC721({ contract });
  if (!_isERC721) {
    return c.json(
      {
        error: "contract is not an erc721 contract",
      },
      400,
    );
  }

  // Get the startTokenId and highest tokenId of the collection
  // then loop over it until all owners are fetched
  const [startTokenId_, maxSupply] = await Promise.allSettled([
    startTokenId({ contract }),
    nextTokenIdToMint({ contract }),
    totalSupply({ contract }),
  ]).then(([_startTokenId, _next, _total]) => {
    // default to 0 if startTokenId is not available
    const startTokenId__ =
      _startTokenId.status === "fulfilled" ? _startTokenId.value : 0n;
    let maxSupply_: bigint;
    // prioritize nextTokenIdToMint
    if (_next.status === "fulfilled") {
      // because we always default the startTokenId to 0 we can safely just always subtract here
      maxSupply_ = _next.value - startTokenId__;
    }
    // otherwise use totalSupply
    else if (_total.status === "fulfilled") {
      maxSupply_ = _total.value;
    } else {
      throw new Error(
        "Contract requires either `nextTokenIdToMint` or `totalSupply` function available to determine the next token ID to mint",
      );
    }
    return [startTokenId__, maxSupply_] as const;
  });
  const maxId = maxSupply + startTokenId_;

  const promises: Promise<{
    owner: string;
    tokenId: string;
  }>[] = [];

  for (let i = startTokenId_; i < maxId; i++) {
    promises.push(
      (async () => {
        const tokenId = i;
        const owner = await ownerOf({ contract, tokenId });
        return {
          owner,
          tokenId: String(tokenId),
        };
      })(),
    );
  }
  const data = await handleRequestLimit<{
    owner: string;
    tokenId: string;
  }>(promises, 100);
  const onlyOwners = data.map((item) => item.owner);
  return c.json(onlyOwners, 200);
});

export default erc721Owners;
