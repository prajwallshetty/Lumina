"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";

type AppProvidersProps = {
  children: ReactNode;
  /** Website defaults to light with no switcher; admin enables the toggle. */
  enableThemeToggle?: boolean;
  defaultTheme?: "light" | "dark" | "system";
};

export function AppProviders({
  children,
  enableThemeToggle = false,
  defaultTheme = "light",
}: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableThemeToggle}
      forcedTheme={enableThemeToggle ? undefined : defaultTheme}
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </QueryProvider>
    </ThemeProvider>
  );
}
