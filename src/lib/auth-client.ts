import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  // Exposes user.additionalFields (role) on signUp.email / session types.
  plugins: [inferAdditionalFields<typeof auth>()],
});
