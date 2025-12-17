import { z } from "zod";


export const TypingTestInputSchema = z.object({
  wpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  duration: z.number().positive(),

  rawWpm: z.number().min(0).optional(),

  mode: z.string().optional(),
  language: z.string().optional(),
  textContent: z.string().optional(),

  errors: z.number().min(0).optional(),
  correctChars: z.number().min(0).optional(),
  incorrectChars: z.number().min(0).optional(),
});
