/**
 * Service catalogue seed reference. These are the service types the studio
 * offers; real content (overview, benefits, process, FAQs, media) is managed
 * per-service in the Services CMS. Used only to bootstrap/seed slugs.
 */
export const serviceCatalog = [
  { slug: "living-room", title: "Living Room", icon: "Sofa" },
  { slug: "bedroom", title: "Bedroom", icon: "BedDouble" },
  { slug: "kitchen", title: "Kitchen", icon: "CookingPot" },
  { slug: "office", title: "Office", icon: "Briefcase" },
  { slug: "commercial", title: "Commercial", icon: "Building2" },
  { slug: "luxury-villa", title: "Luxury Villa", icon: "Castle" },
  { slug: "apartment", title: "Apartment", icon: "Building" },
  { slug: "turnkey-interior", title: "Turnkey Interior", icon: "KeyRound" },
  { slug: "wardrobe", title: "Wardrobe", icon: "DoorClosed" },
  { slug: "lighting", title: "Lighting", icon: "Lightbulb" },
  { slug: "false-ceiling", title: "False Ceiling", icon: "PanelTop" },
  { slug: "furniture", title: "Furniture", icon: "Armchair" },
] as const;
