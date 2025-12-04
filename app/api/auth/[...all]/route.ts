import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Expose Better Auth as a Next.js App Router route handler
export const { GET, POST, PUT, PATCH, DELETE } = toNextJsHandler(auth);


