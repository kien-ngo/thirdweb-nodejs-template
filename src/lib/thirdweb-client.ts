import { createThirdwebClient } from "thirdweb";
import { getEnv } from "./env.js";

export const thirdwebClient = createThirdwebClient({
  secretKey: getEnv("THIRDWEB_SECRET_KEY"),
});
