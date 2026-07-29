import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { MediaContainer } from "@/components/shared/media-container";
import { ContactForm } from "@/components/website/contact-form";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch to book a consultation or discuss your project.",
  path: "/contact",
});

type Search = { searchParams: Promise<{ service?: string; intent?: string }> };

import { OfficeMaps } from "@/components/website/office-maps";

export default async function ContactPage({ searchParams }: Search) {
  const { service } = await searchParams;
  const settings = await getSiteSettings().catch(() => null);

  return (
    <Section className="pt-32 md:pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's start a conversation"
            description="Tell us about your space and goals — we'll get back within one business day."
          />

          <div className="mt-10 space-y-4">
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm hover:text-accent">
                <Mail className="h-5 w-5 text-accent" /> {settings.email}
              </a>
            )}
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-sm hover:text-accent">
                <Phone className="h-5 w-5 text-accent" /> {settings.phone}
              </a>
            )}
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                className="flex items-center gap-3 text-sm hover:text-accent"
              >
                <MessageCircle className="h-5 w-5 text-accent" /> WhatsApp us
              </a>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <OfficeMaps />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <ContactForm defaultService={service} />
        </div>
      </div>
    </Section>
  );
}
