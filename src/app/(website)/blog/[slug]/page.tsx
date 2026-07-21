import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/shared/section";
import { MediaContainer } from "@/components/shared/media-container";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlogCard } from "@/components/website/blog-card";
import { SectionHeading } from "@/components/shared/section";
import { getPostBySlug, getRelatedPosts } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { formatDate, initials } from "@/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found", path: `/blog/${slug}` });
  return buildMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    path: `/blog/${slug}`,
    image: post.coverUrl,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id, post.categoryId, 3);

  return (
    <>
      <article>
        <Section className="pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {post.category && <Badge variant="accent">{post.category.name}</Badge>}
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingTime && <span>· {post.readingTime} min read</span>}
            </div>
            <h1 className="mt-4 text-4xl font-medium md:text-5xl">{post.title}</h1>
            {post.author && (
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  {post.author.image && <AvatarImage src={post.author.image} alt={post.author.name} />}
                  <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
            )}
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <MediaContainer src={post.coverUrl} label="Cover" aspect="aspect-[16/9]" rounded="rounded-2xl" priority />
          </div>

          <div
            className="prose prose-stone mx-auto mt-12 max-w-3xl dark:prose-invert"
            // Content is authored via the CMS rich-text editor and sanitized on write.
            dangerouslySetInnerHTML={{ __html: post.content ?? "<p>Content coming soon.</p>" }}
          />

          {post.tags.length > 0 && (
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Badge key={tag.id} variant="secondary">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </Section>
      </article>

      {related.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="Keep reading" title="Related articles" />
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
