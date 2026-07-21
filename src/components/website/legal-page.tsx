import { Section } from "@/components/shared/section";
import { getPageBySlug } from "@/services/content.service";

/** Shared renderer for CMS-managed legal/static pages (privacy, terms, …). */
export async function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const page = await getPageBySlug(slug);

  return (
    <Section className="pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-medium">{page?.title ?? fallbackTitle}</h1>
        {page?.updatedAt && (
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated {new Date(page.updatedAt).toLocaleDateString()}
          </p>
        )}
        <div
          className="prose prose-stone mt-10 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: page?.content ?? "<p>This page will be published from the CMS.</p>",
          }}
        />
      </div>
    </Section>
  );
}
