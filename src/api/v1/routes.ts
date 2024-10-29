import { OpenAPIHono } from "@hono/zod-openapi";
import erc721BatchClaimTo from "../examples/batch-claim-to/route.js";
import erc721Owners from "../examples/get-erc721-owners/routes.js";
import optimizeERC721DropClaimContent from "../examples/optimize-erc721-claim-batch-content/route.js";
import todos from "./todos/routes.js";

const v1Routes = new OpenAPIHono();

v1Routes.route("/todos", todos);

v1Routes.route("/get-erc721-owners", erc721Owners);

v1Routes.route(
  "/optimize-erc721-claim-batch-content",
  optimizeERC721DropClaimContent,
);

v1Routes.route("/batch-claim-to", erc721BatchClaimTo);

export default v1Routes;
