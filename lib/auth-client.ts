// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // optional if same domain
});

// Export commonly used methods for convenience
export const { 
  signIn, 
  signUp, 
  signOut,
  useSession,
} = authClient;