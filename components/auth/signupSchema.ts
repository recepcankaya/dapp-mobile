import { z } from "zod";

export const SignupFormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters" }),
    email: z.string().email({ message: "Email must be a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine((value) => /[a-z]/i.test(value) && /\d/.test(value), {
        message: "Password must contain both number and character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type SignupFormFields = z.infer<typeof SignupFormSchema>;
