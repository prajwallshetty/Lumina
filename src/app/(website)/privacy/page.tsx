import type { Metadata } from "next";
import { LegalPage } from "@/components/website/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage slug="privacy" fallbackTitle="Privacy Policy" />;
}
