/** Fallback navigation used until the CMS-managed NavItem rows are populated. */
export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Projects", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/about#process" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "Projects", href: "/portfolio" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Process", href: "/about#process" },
      { label: "Journal", href: "/blog" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Residential Interiors", href: "/services" },
      { label: "Commercial Interiors", href: "/services" },
      { label: "Renovation", href: "/services" },
      { label: "Furniture Design", href: "/services" },
      { label: "Turnkey Projects", href: "/services" },
    ],
  },
];
