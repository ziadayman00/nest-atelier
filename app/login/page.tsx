"use client";

import { Suspense } from "react";
import LoginForm from "./login-form";
import { Spinner } from "@/components/ui/spinner";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  return (
    <Container className="py-16">
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
