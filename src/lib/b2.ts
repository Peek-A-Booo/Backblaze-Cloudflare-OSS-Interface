import B2 from "backblaze-b2";
import { env } from "@/env.mjs";

export const b2 = new B2({
  applicationKeyId: env.APP_KEY_ID, // or accountId: 'accountId'
  applicationKey: env.APP_KEY, // or masterApplicationKey
});
