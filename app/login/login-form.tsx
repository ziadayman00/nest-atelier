"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, getAuthErrorMessage } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const user = await login(data.email, data.password);
      router.push(user.role === "admin" && redirect === "/account" ? "/admin" : redirect);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-lg glass-card p-8 sm:p-12 space-y-6">
      <div className="border-b border-[#E2DCD2] pb-4 space-y-2">
        <span className="pill-accent-sage text-xs">NEST Client Portal</span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#161716]">Welcome Back</h1>
        <p className="text-xs text-[#6B7068] font-light">Sign in to manage orders and spatial consultations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email Address" type="email" placeholder="soliman@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full py-3.5">
          Sign In ↗
        </Button>
      </form>

      <div className="border-t border-[#E2DCD2] pt-4 text-center text-xs text-[#6B7068]">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="font-semibold text-[#161716] hover:underline">
          Register for free
        </Link>
      </div>
    </div>
  );
}
