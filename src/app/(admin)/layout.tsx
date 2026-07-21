import { AppProviders } from "@/providers";

/**
 * Admin route group root. Isolated from the public site: its own providers,
 * theme toggle enabled, dark-mode ready. Access control is enforced in the
 * nested (protected) layout.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders enableThemeToggle defaultTheme="light">
      {children}
    </AppProviders>
  );
}
