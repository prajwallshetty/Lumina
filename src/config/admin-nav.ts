import type { UserRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  Info,
  Wrench,
  FolderKanban,
  Images,
  ArrowLeftRight,
  Quote,
  Newspaper,
  HelpCircle,
  Briefcase,
  Inbox,
  CalendarClock,
  ImagePlus,
  Users,
  Settings,
  Search,
  ScrollText,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[]; // undefined = all admin roles
  group: string;
};

/**
 * Admin sidebar. `roles` gates visibility; the server also enforces access.
 */
export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "Overview" },

  { label: "Homepage", href: "/admin/homepage", icon: Home, group: "Content" },
  { label: "About", href: "/admin/about", icon: Info, group: "Content" },
  { label: "Services", href: "/admin/services", icon: Wrench, group: "Content" },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban, group: "Content" },
  { label: "Gallery", href: "/admin/gallery", icon: Images, group: "Content" },
  { label: "Before & After", href: "/admin/before-after", icon: ArrowLeftRight, group: "Content" },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote, group: "Content" },
  { label: "Blog", href: "/admin/blog", icon: Newspaper, group: "Content" },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, group: "Content" },
  { label: "Careers", href: "/admin/careers", icon: Briefcase, group: "Content" },

  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox, group: "Sales", roles: ["SUPER_ADMIN", "ADMIN", "SALES"] },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarClock, group: "Sales", roles: ["SUPER_ADMIN", "ADMIN", "SALES", "DESIGNER"] },

  { label: "Media Library", href: "/admin/media", icon: ImagePlus, group: "Assets" },

  { label: "Users", href: "/admin/users", icon: Users, group: "System", roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "SEO", href: "/admin/seo", icon: Search, group: "System", roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"] },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText, group: "System", roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, group: "System", roles: ["SUPER_ADMIN", "ADMIN"] },
];

export const adminNavGroups = ["Overview", "Content", "Sales", "Assets", "System"] as const;
