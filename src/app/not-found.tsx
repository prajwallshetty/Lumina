import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-heading text-7xl font-semibold text-accent">404</p>
      <h1 className="text-2xl font-medium">This page couldn&apos;t be found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for may have been moved or no longer exists.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back home
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
        >
          View work
        </Link>
      </div>
    </main>
  );
}
