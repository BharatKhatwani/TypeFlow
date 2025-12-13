// "use client";
// import React, { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import Image from "next/image"; 
// import keyboard from "@/public/keyboard.jpg";

// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [step, setStep] = useState<"signup" | "otp">("signup");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const result = await authClient.verifyEmail({
//         email,
//         token: otp,
//       });

//       if (result.error) {
//         setError(result.error.message || "Invalid verification code");
//         setLoading(false);
//         return;
//       }

//       // After successful verification, redirect to dashboard
//       router.push("/home");
//     } catch (error) {
//       console.error("Verification error:", error);
//       setError("Failed to verify email. Please try again.");
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignup = () => {
//     authClient.signIn.social({
//       provider: "google",
//       callbackURL: "/home",
//     });
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Correct usage of authClient.signUp.email
//       const result = await authClient.signUp.email({
//         name: username,
//         email,
//         password,
//         callbackURL: "/home",
//       });

//       if (result.error) {
//         setError(result.error.message ?? "An unexpected error occurred");
//         setLoading(false);
//         return;
//       }

//       // OTP verification disabled - redirect directly to dashboard
//       router.push("/home");
//     } catch (error) {
//       console.error("Signup error:", error);
//       setError("Failed to sign up. Please try again.");
//       setLoading(false);
//     }
//   };

//   // Resend OTP functionality
//   const handleResendOtp = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const result = await authClient.sendVerificationEmail({
//         email,
//       });

//       if (result.error) {
//         setError(result.error.message || "Failed to resend code");
//       } else {
//         setError("");
//         // Show success message
//         alert("Verification code sent! Check your email.");
//       }
//     } catch (error) {
//       console.error("Resend error:", error);
//       setError("Failed to resend code. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTP Verification Screen
//   if (step === "otp") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-12">
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
//             <p className="text-gray-600">
//               We've sent a verification code to<br />
//               <span className="font-medium text-gray-800">{email}</span>
//             </p>
//           </div>

//           <form onSubmit={handleVerifyOtp} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Verification Code
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit code"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
//                 required
//                 maxLength={6}
//               />
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify Email"}
//             </button>
//           </form>

//           <div className="mt-6 text-center space-y-2">
//             <p className="text-sm text-gray-600">
//               Didn't receive the code?{" "}
//               <button 
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={loading}
//                 className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
//               >
//                 Resend Code
//               </button>
//             </p>
//             <p className="text-sm text-gray-600">
//               <button 
//                 type="button"
//                 onClick={() => setStep("signup")}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Go back to signup
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Signup Screen
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex flex-col md:flex-row">
          
//           {/* LEFT SIDE FORM */}
//           <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
//             <div className="max-w-md mx-auto w-full">
//               <h2 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h2>
//               <p className="text-gray-600 mb-8">Join us today and get started</p>
              
//               <form onSubmit={handleSignup} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter your username"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                     value={username}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setUsername(e.target.value)
//                     }
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="you@example.com"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                     value={email}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setEmail(e.target.value)
//                     }
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="Minimum 8 characters"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                     value={password}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setPassword(e.target.value)
//                     }
//                     required
//                     minLength={8}
//                   />
//                 </div>

//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Creating account..." : "Sign Up"}
//                 </button>
//               </form>

//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500">OR</span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleGoogleSignup}
//                 className="w-full bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg flex items-center justify-center gap-3 font-medium transition duration-200"
//               >
//                 <img src="/globe.svg" alt="Google" className="w-5 h-5" />
//                 Sign Up with Google
//               </button>

//               <p className="mt-6 text-center text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Sign in
//                 </a>
//               </p>
//             </div>
//           </div>

//           {/* RIGHT SIDE IMAGE */}
//           <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-blue-600 to-indigo-700">
//             <div className="absolute inset-0 flex items-center justify-center p-12">
//               <div className="text-white text-center">
//                 <h3 className="text-4xl font-bold mb-4">Welcome to Our Platform</h3>
//                 <p className="text-xl text-blue-100">
//                   Start your journey with us today and unlock amazing features
//                 </p>
//               </div>
//             </div>
//             <div className="absolute inset-0 opacity-20">
//               <Image
//                 src={keyboard}
//                 alt="Keyboard image"
//                 fill
//                 sizes="(min-width: 768px) 50vw, 100vw"
//                 loading="eager"
//                 className="object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



























































//  "use client";

// import React, { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const result = await authClient.signIn.email({
//       email,
//       password,
//     });

//     if (result.error) {
//       setError(result.error.message ?? "An unexpected error occurred");
//       setLoading(false);
//       return;
//     }

//     router.push("/home");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10">
//         <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
//           Login
//         </h2>
//         <p className="text-gray-600 mb-8 text-center">
//           Enter your email and password to continue
//         </p>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               value={email}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmail(e.target.value)
//               }
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Your password"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               value={password}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setPassword(e.target.value)
//               }
//               required
//               minLength={8}
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
