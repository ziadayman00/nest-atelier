"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, getAuthErrorMessage } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await registerUser(data.fullName, data.email, data.password);
      router.push("/account");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-12">
      <div className="mx-auto max-w-lg glass-card p-8 sm:p-12 space-y-6">
        <div className="border-b border-[#E2DCD2] pb-4 space-y-2">
          <span className="pill-accent-sage text-xs">Join NEST Atelier</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716]">Create Account</h1>
          <p className="text-xs text-[#6B7068] font-light">Join NEST to shop furniture and track spatial consultations.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Soliman Mansour" error={errors.fullName?.message} {...register("fullName")} />
          <Input label="Email Address" type="email" placeholder="soliman@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full py-3.5">
            Create Account ↗
          </Button>
        </form>

        <div className="border-t border-[#E2DCD2] pt-4 text-center text-xs text-[#6B7068]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#161716] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
