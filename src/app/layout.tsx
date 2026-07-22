import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Text, DM_Sans, Hanken_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-display-var",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-var",
  display: "swap",
  weight: ["400", "500"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-label-var",
  display: "swap",
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${libreCaslon.variable} ${dmSans.variable} ${hankenGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
