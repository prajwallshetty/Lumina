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

export default async function ContactPage({ searchParams }: Search) {
  const { service } = await searchParams;
  const settings = await getSiteSettings().catch(() => null);

  return (
    <Section className="pt-16 md:pt-24">
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
            {(settings?.addressLine || settings?.city) && (
              <p className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span>{[settings?.addressLine, settings?.city].filter(Boolean).join(", ")}</span>
              </p>
            )}
          </div>

          <div className="mt-10">
            {settings?.mapEmbedUrl ? (
              <iframe
                src={settings.mapEmbedUrl}
                title="Studio location"
                className="h-64 w-full rounded-xl border border-border"
                loading="lazy"
              />
            ) : (
              <MediaContainer src={null} label="Map" aspect="aspect-[16/9]" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <ContactForm defaultService={service} />
        </div>
      </div>
    </Section>
  );
}
