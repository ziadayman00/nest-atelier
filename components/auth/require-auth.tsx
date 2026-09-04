"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Container } from "@/components/ui/container";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </Container>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login?redirect=/admin");
      else if (user.role !== "admin") router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </Container>
    );
  }

  return <>{children}</>;
}
