/** Fallback navigation used until the CMS-managed NavItem rows are populated. */
export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Before & After", href: "/before-after" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Studio",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Before & After", href: "/before-after" },
      { label: "Gallery", href: "/gallery" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
