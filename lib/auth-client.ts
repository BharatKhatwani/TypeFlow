import { createAuthClient } from "better-auth/react";

// Better Auth requires an absolute base URL
// e.g. NEXT_PUBLIC_APP_URL="http://localhost:4000"
const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const authClient = createAuthClient({
  baseURL: `${appUrl}/api/auth`,
});

export const { signUp, signIn, signOut, verifyEmail, useSession } = authClient;
