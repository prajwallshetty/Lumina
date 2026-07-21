import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { BlogCard } from "@/components/website/blog-card";
import { getPublishedPosts, getBlogCategories } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Journal",
  description: "Notes on interior design, materials and the craft of considered spaces.",
  path: "/blog",
});

type Search = { params: Promise<Record<string, never>>; searchParams: Promise<{ category?: string }> };

export default async function BlogPage({ searchParams }: Search) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPublishedPosts({ categorySlug: category }),
    getBlogCategories(),
  ]);

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading eyebrow="Journal" title="Ideas & inspiration" />

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !category ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c.slug ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 6) * 0.04}>
              <BlogCard post={post} />
            </Reveal>
          ))
        ) : (
          <p className="text-muted-foreground">Posts will appear here once published in the CMS.</p>
        )}
      </div>
    </Section>
  );
}
