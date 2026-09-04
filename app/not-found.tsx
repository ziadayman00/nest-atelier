import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="font-display text-5xl text-nest-charcoal">404</h1>
      <p className="mt-4 text-nest-warm-gray">This page could not be found.</p>
      <Link href="/" className="mt-8 text-sm text-nest-sage hover:underline">
        Back to home
      </Link>
    </Container>
  );
}
