import Link from "next/link";
import { MediaContainer } from "@/components/shared/media-container";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

type BlogCardData = {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  publishedAt?: Date | null;
  readingTime?: number | null;
  category?: { name: string } | null;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl">
        <MediaContainer
          src={post.coverUrl}
          alt={post.title}
          label="Cover"
          aspect="aspect-[16/10]"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        {post.readingTime && <span>· {post.readingTime} min read</span>}
      </div>
      <h3 className="font-heading text-xl font-medium transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      {post.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
    </Link>
  );
}
