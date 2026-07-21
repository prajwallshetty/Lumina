import { Logo } from "@/components/shared/logo";

export function MaintenanceScreen({
  message,
  endsAt,
}: {
  message?: string | null;
  endsAt?: Date | null;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-8 text-2xl" />
      <span className="text-eyebrow text-accent">We&apos;ll be back soon</span>
      <h1 className="mt-4 max-w-xl text-3xl font-medium md:text-4xl">
        {message ?? "Our site is undergoing scheduled maintenance."}
      </h1>
      {endsAt && (
        <p className="mt-4 text-muted-foreground">
          Expected back by{" "}
          {new Date(endsAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          .
        </p>
      )}
    </main>
  );
}
