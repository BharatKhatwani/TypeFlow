import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // OTP verification disabled
  },

  // OTP/Email Verification Code - COMMENTED OUT
  // emailVerification: {
  //   expiresIn: 600, // 10 min

  //   sendVerificationEmail: async ({ user, token }) => {
  //     // Always log OTP to console for debugging
  //     console.log(
  //       `[BetterAuth] OTP for ${user.email}: ${token}`,
  //     );

  //     // Check if RESEND_API_KEY is set
  //     if (!process.env.RESEND_API_KEY) {
  //       console.warn(
  //         "[BetterAuth] RESEND_API_KEY not set in environment variables. Email will not be sent.",
  //       );
  //       console.log(
  //         `[BetterAuth] Please add RESEND_API_KEY to your .env.local file. OTP for ${user.email} is: ${token}`,
  //       );
  //       return;
  //     }

  //     try {
  //       const { Resend } = await import("resend");
  //       const resend = new Resend(process.env.RESEND_API_KEY);

  //       // Resend test domain (onboarding@resend.dev) only allows sending to account owner's email
  //       // For production, verify a domain at resend.com/domains and use that domain
  //       const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        
  //       // If using test domain and recipient is not the account owner, log warning
  //       if (fromEmail === "onboarding@resend.dev" && user.email !== "bharatkhatwani796@gmail.com") {
  //         console.warn(
  //           `[BetterAuth] Resend test domain can only send to bharatkhatwani796@gmail.com. ` +
  //           `Attempting to send to ${user.email} will fail. ` +
  //           `To send to other emails, verify a domain at resend.com/domains and set RESEND_FROM_EMAIL.`
  //         );
  //       }
        
  //       console.log(`[BetterAuth] Attempting to send email to ${user.email} from ${fromEmail}`);

  //       const result = await resend.emails.send({
  //         from: fromEmail,
  //         to: user.email,
  //         subject: "Verify Your Email - OTP Code",
  //         html: `
  //           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //             <h1 style="color: #2563eb;">Email Verification</h1>
  //             <p>Your verification code is:</p>
  //             <h2 style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 4px; color: #1f2937; border-radius: 8px;">
  //               ${token}
  //             </h2>
  //             <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
  //           </div>
  //         `,
  //       });

  //       if (result.error) {
  //         console.error("[BetterAuth] Resend API error:", result.error);
  //         // Don't throw - just log the error. Better Auth will still create the verification record.
  //         // The OTP is logged above so users can still verify manually.
  //         return;
  //       }

  //       console.log(`[BetterAuth] Email sent successfully! Message ID: ${result.data?.id}`);
  //     } catch (error) {
  //       console.error("[BetterAuth] Error sending verification email:", error);
  //       // Don't throw - Better Auth will still create the user/verification record
  //       // The OTP is logged above so you can still test
  //     }
  //   },
  // },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});
