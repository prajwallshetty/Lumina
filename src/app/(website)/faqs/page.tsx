import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getPublishedFaqs } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQs",
  description: "Answers to common questions about our design process, timelines and pricing.",
  path: "/faqs",
});

export default async function FaqsPage() {
  const faqs = await getPublishedFaqs();

  // Group by category name (uncategorised last).
  const groups = new Map<string, typeof faqs>();
  for (const faq of faqs) {
    const key = faq.category?.name ?? "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(faq);
  }

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading eyebrow="FAQs" title="Questions, answered" />
      <div className="mx-auto mt-12 max-w-3xl space-y-12">
        {faqs.length > 0 ? (
          Array.from(groups.entries()).map(([group, items]) => (
            <div key={group}>
              <h2 className="mb-2 font-heading text-lg font-medium text-accent">{group}</h2>
              <Accordion type="single" collapsible>
                {items.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">FAQs will appear here once added in the CMS.</p>
        )}
      </div>
    </Section>
  );
}
