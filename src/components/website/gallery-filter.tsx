"use client";

import { useState, useMemo } from "react";
import { Search, Film, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MediaContainer } from "@/components/shared/media-container";
import { Reveal } from "@/components/shared/reveal";

type GalleryItemData = {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: string;
  projectId?: string | null;
  isFeatured: boolean;
  createdAt: string | Date;
  tags: string[];
  order: number;
};

// Masonry-like varied aspect ratios for visual rhythm.
const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"];

export function GalleryFilter({ items }: { items: GalleryItemData[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "order">("latest");

  // Dynamic filter lists from database items
  const categories = useMemo(() => {
    const cats = items.map((i) => i.category).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, [items]);

  const tags = useMemo(() => {
    const allTags = items.flatMap((i) => i.tags || []).filter(Boolean);
    return ["all", ...Array.from(new Set(allTags))];
  }, [items]);

  // Combined filtering & sorting
  const filtered = useMemo(() => {
    let result = [...items];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          (i.title || "").toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q) ||
          (i.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== "all") {
      result = result.filter((i) => i.category === activeCategory);
    }

    // Tag
    if (activeTag !== "all") {
      result = result.filter((i) => (i.tags || []).includes(activeTag));
    }

    // Featured
    if (onlyFeatured) {
      result = result.filter((i) => i.isFeatured);
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.order - b.order;
    });
  }, [items, search, activeCategory, activeTag, onlyFeatured, sortBy]);

  return (
    <div className="space-y-10">
      {/* Premium Filter Control Bar */}
      <div className="bg-secondary/20 backdrop-blur-md border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gallery by keyword, category, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-background border-border/60 rounded-xl"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-3 bg-background border border-border/60 px-4 h-11 rounded-xl">
            <Switch id="featured-toggle" checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
            <Label htmlFor="featured-toggle" className="text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent/20 text-accent" /> Featured Only
            </Label>
          </div>

          {/* Sort Selector */}
          <div className="flex gap-1.5 bg-background/50 border border-border/60 p-1 rounded-xl h-11">
            <Button
              variant={sortBy === "latest" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("latest")}
              className="text-xs font-semibold uppercase tracking-wider rounded-lg h-full"
            >
              Latest
            </Button>
            <Button
              variant={sortBy === "order" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("order")}
              className="text-xs font-semibold uppercase tracking-wider rounded-lg h-full"
            >
              Order
            </Button>
          </div>
        </div>

        {/* Categories Badges */}
        <div className="space-y-2">
          <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer ${
                  activeCategory === cat
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Badges */}
        {tags.length > 1 && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    activeTag === tag
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/40 bg-background/40 text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  {tag === "all" ? "All Tags" : `#${tag}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Masonry Image/Video Grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 transition-all duration-500">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <Reveal key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-xl border border-border/60 hover:shadow-lg transition-all duration-300" delay={(i % 6) * 0.03}>
              <MediaContainer
                src={item.url}
                alt={item.title}
                label={item.category}
                kind={item.type.toLowerCase() as "image" | "video"}
                aspect={ASPECTS[i % ASPECTS.length]}
                className="transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Hover Overlay with Title and Badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4 pointer-events-none">
                <span className="text-[9px] font-bold tracking-widest text-accent uppercase">{item.category}</span>
                <h3 className="font-heading text-lg font-light text-white leading-tight mt-1">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-neutral-300 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-neutral-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Icon indicator for videos */}
              {item.type === "VIDEO" && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs p-1.5 rounded-full text-white border border-white/10">
                  <Film className="h-3.5 w-3.5" />
                </div>
              )}
            </Reveal>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-secondary/5 rounded-2xl border border-dashed border-border w-full">
            <p className="text-muted-foreground text-sm font-medium">No design assets match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
