import type { Metadata } from "next";
import { LegalPage } from "@/components/website/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Terms of Service", path: "/terms" });

export default function TermsPage() {
  return <LegalPage slug="terms" fallbackTitle="Terms of Service" />;
}
