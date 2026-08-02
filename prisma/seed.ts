import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const PERMISSION_GROUPS: Record<string, string[]> = {
  Dashboard: ["dashboard.view"],
  Homepage: ["homepage.view", "homepage.update"],
  About: ["about.view", "about.update"],
  Services: ["services.view", "services.create", "services.update", "services.delete"],
  Portfolio: ["portfolio.view", "portfolio.create", "portfolio.update", "portfolio.delete"],
  Gallery: ["gallery.view", "gallery.manage"],
  Testimonials: ["testimonials.view", "testimonials.manage"],
  Blog: ["blog.view", "blog.create", "blog.update", "blog.delete", "blog.publish"],
  Faqs: ["faqs.view", "faqs.manage"],
  Media: ["media.view", "media.upload", "media.delete"],
  Inquiries: ["inquiries.view", "inquiries.update", "inquiries.assign"],
  Bookings: ["bookings.view", "bookings.update", "bookings.assign"],
  Careers: ["careers.view", "careers.manage"],
  Users: ["users.view", "users.create", "users.update", "users.delete"],
  Settings: ["settings.view", "settings.update"],
  Seo: ["seo.view", "seo.update"],
};

const FULL_ACCESS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
const roleDefaults = (key: string): UserRole[] => {
  const readOnly = key.endsWith(".view");
  const base = [...FULL_ACCESS];
  if (readOnly) base.push(UserRole.CONTENT_EDITOR, UserRole.DESIGNER, UserRole.SALES, UserRole.VIEWER);
  if (
    key.startsWith("blog.") ||
    key.startsWith("portfolio.") ||
    key.startsWith("services.") ||
    key.startsWith("gallery.") ||
    key.startsWith("media.") ||
    key.startsWith("faqs.") ||
    key.startsWith("about.") ||
    key.startsWith("homepage.")
  ) {
    if (!base.includes(UserRole.CONTENT_EDITOR)) base.push(UserRole.CONTENT_EDITOR);
  }
  if (key.startsWith("inquiries.") || key.startsWith("bookings.")) {
    if (!base.includes(UserRole.SALES)) base.push(UserRole.SALES);
  }
  return base;
};

async function seedPermissions() {
  for (const [group, keys] of Object.entries(PERMISSION_GROUPS)) {
    for (const key of keys) {
      const label = key
        .split(".")
        .slice(1)
        .join(" ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const permission = await prisma.permission.upsert({
        where: { key },
        update: { label, group },
        create: { key, label, group },
      });
      const allowedRoles = roleDefaults(key);
      for (const role of Object.values(UserRole)) {
        await prisma.rolePermission.upsert({
          where: { role_permissionId: { role, permissionId: permission.id } },
          update: { allowed: allowedRoles.includes(role) },
          create: { role, permissionId: permission.id, allowed: allowedRoles.includes(role) },
        });
      }
    }
  }
}

async function seedSingletons() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { companyName: "Lumina Spaces" },
    create: { id: "singleton", companyName: "Lumina Spaces" },
  });

  await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: {
      heroTitle: "Lumina Spaces",
      heroSubtitle: "Crafting architectural interiors and turnkey spaces.",
    },
    create: {
      id: "singleton",
      heroTitle: "Lumina Spaces",
      heroSubtitle: "Crafting architectural interiors and turnkey spaces.",
    },
  });

  const aboutDescription = `With 8+ years of industry experience, Lumina Spaces has been delivering premium residential interiors, hospitality interiors, commercial fit-outs, civil construction, and turnkey execution projects. Over the years, we have built a reputation for exceptional craftsmanship, meticulous execution, and delivering projects on time without compromising on quality.\n\nOur experience enables us to execute projects of every scale with confidence, precision, and professionalism, ensuring every space is completed to the highest standards.`;

  const visionText = `To be a trusted leader in premium residential interiors, hospitality interiors, commercial fit-outs, civil construction, and turnkey execution by creating exceptional spaces that combine quality, innovation, and timely delivery.`;

  const missionText = `• To deliver premium residential, hospitality, and commercial projects with superior craftsmanship and precision.
• To complete every project within the committed timeline without compromising on quality.
• To provide end-to-end civil, interior, and turnkey execution tailored to our clients' vision and requirements.
• To foster long-term relationships through trust, transparency, and professional excellence.
• To continuously innovate by adopting modern construction techniques, premium materials, and efficient project management practices.`;

  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {
      storyTitle: "ABOUT LUMINA SPACES",
      storyBody: aboutDescription,
      experienceText: "Since 2017",
      yearsOfExperienceCount: "8+",
      completedProjectsCount: "500+",
      clientSatisfactionCount: "99%",
      visionTitle: "Our Vision",
      vision: visionText,
      missionTitle: "Our Mission",
      mission: missionText,
    },
    create: {
      id: "singleton",
      storyTitle: "ABOUT LUMINA SPACES",
      storyBody: aboutDescription,
      experienceText: "Since 2017",
      yearsOfExperienceCount: "8+",
      completedProjectsCount: "500+",
      clientSatisfactionCount: "99%",
      visionTitle: "Our Vision",
      vision: visionText,
      missionTitle: "Our Mission",
      mission: missionText,
    },
  });
}

const SEED_SERVICES = [
  {
    title: "Residential Turnkey Interiors",
    slug: "residential-turnkey-interiors",
    excerpt: "Complete interior solutions from concept to handover including design, execution, furniture, electrical, plumbing and finishing works.",
    overview: "Complete interior solutions from concept to handover including design, execution, furniture, electrical, plumbing and finishing works.",
    order: 1,
  },
  {
    title: "Office Interiors",
    slug: "office-interiors",
    excerpt: "Functional and premium workspace interiors designed and executed to enhance productivity and brand identity.",
    overview: "Functional and premium workspace interiors designed and executed to enhance productivity and brand identity.",
    order: 2,
  },
  {
    title: "Hospitality Interiors",
    slug: "hospitality-interiors",
    excerpt: "Specialized interior execution for hotels, restaurants, cafés, resorts, lounges and hospitality spaces.",
    overview: "Specialized interior execution for hotels, restaurants, cafés, resorts, lounges and hospitality spaces.",
    order: 3,
  },
  {
    title: "Construction Services",
    slug: "construction-services",
    excerpt: "Residential and commercial construction with superior quality and structural integrity.",
    overview: "Residential and commercial construction with superior quality and structural integrity.",
    order: 4,
  },
  {
    title: "Maintenance Services",
    slug: "maintenance-services",
    excerpt: "Repair, renovation and maintenance solutions.",
    overview: "Repair, renovation and maintenance solutions.",
    order: 5,
  },
  {
    title: "Fabrication Works",
    slug: "fabrication-works",
    excerpt: "Custom MS, SS, aluminium and metal fabrication.",
    overview: "Custom MS, SS, aluminium and metal fabrication.",
    order: 6,
  },
  {
    title: "Steel Structures",
    slug: "steel-structures",
    excerpt: "Design, fabrication and installation of structural steel structures.",
    overview: "Design, fabrication and installation of structural steel structures.",
    order: 7,
  },
  {
    title: "Cafe Kiosks",
    slug: "cafe-kiosks",
    excerpt: "Customized café kiosks and food counters.",
    overview: "Customized café kiosks and food counters.",
    order: 8,
  },
  {
    title: "Layout Planning",
    slug: "layout-planning",
    excerpt: "Architectural planning and optimized space design.",
    overview: "Architectural planning and optimized space design.",
    order: 9,
  },
];

async function seedServices() {
  for (const item of SEED_SERVICES) {
    await prisma.service.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        overview: item.overview,
        order: item.order,
        isPublished: true,
      },
      create: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        overview: item.overview,
        order: item.order,
        isPublished: true,
        isFeatured: true,
      },
    });
  }
}

const SEED_CLIENTS = [
  "V&RO Hospitality",
  "Badmaash",
  "Plan B",
  "Cafe Noir",
  "Sultanate of Shawarma",
  "Novakan",
  "Quarter Peter",
  "Hangover",
  "Table Space Private Limited",
  "Tycoons",
  "Chai Kada",
  "Cleaniac India Pvt. Ltd.",
  "Compass Logistics",
  "KMT Equipment Rental (KSA)",
  "Amplitude Manpower Supplies (KSA)",
  "Apsara Group",
  "Government of Karnataka",
];

async function seedClients() {
  let order = 1;
  for (const name of SEED_CLIENTS) {
    const existing = await prisma.brand.findFirst({ where: { name } });
    if (!existing) {
      await prisma.brand.create({
        data: {
          name,
          order,
          isActive: true,
        },
      });
    }
    order++;
  }
}

const SEED_BEFORE_AFTER = [
  {
    title: "Luxury Residence Transformation",
    caption: "Concept sketch transformed into a timeless luxury residence through premium materials and flawless execution.",
    beforeUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    sketchUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    order: 1,
  },
  {
    title: "Modern Office Interior",
    caption: "From planning sketches to a fully functional premium workspace.",
    beforeUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    sketchUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    order: 2,
  },
  {
    title: "Hospitality Lounge",
    caption: "Luxury hospitality interiors executed with precision from architectural concept to final delivery.",
    beforeUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    sketchUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop",
    order: 3,
  },
  {
    title: "Cafe Interior",
    caption: "Complete transformation from initial concept sketches into a vibrant café experience.",
    beforeUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop",
    sketchUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    order: 4,
  },
];

async function seedBeforeAfter() {
  for (const item of SEED_BEFORE_AFTER) {
    const existing = await prisma.beforeAfter.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.beforeAfter.create({
        data: {
          title: item.title,
          caption: item.caption,
          beforeUrl: item.beforeUrl,
          afterUrl: item.afterUrl,
          sketchUrl: item.sketchUrl,
          order: item.order,
          isFeatured: true,
          isPublished: true,
        },
      });
    }
  }
}

const SEED_TESTIMONIALS = [
  {
    clientName: "Badmaash",
    company: "Badmaash",
    rating: 5,
    quote: "The vibrant aesthetics and structural execution of our restaurant were delivered with perfection. Lumina Spaces understood our brand language flawlessly.",
    order: 1,
  },
  {
    clientName: "Plan B",
    company: "Plan B",
    rating: 5,
    quote: "An outstanding team that transformed our outlet with modern industrial aesthetics. The craftsmanship and attention to detail are spectacular.",
    order: 2,
  },
  {
    clientName: "Sultanate of Shawarma",
    company: "Sultanate of Shawarma",
    rating: 5,
    quote: "Lumina Spaces designed and executed our food outlet with high functionality and premium finishes. Professional and prompt delivery.",
    order: 3,
  },
  {
    clientName: "Novakan",
    company: "Novakan",
    rating: 5,
    quote: "Our new corporate workspace is both functional and beautifully crafted. Highly recommend Lumina for premium turnkey commercial interiors.",
    order: 4,
  },
  {
    clientName: "Quarter Peter",
    company: "Quarter Peter",
    rating: 5,
    quote: "Excellent interior execution. The team handled everything from planning to handover with great diligence and craftsmanship.",
    order: 5,
  },
  {
    clientName: "Hangover",
    company: "Hangover",
    rating: 5,
    quote: "Created a stunning, lively atmosphere for our lounge. Their design solutions and turnkey execution are top-notch.",
    order: 6,
  },
  {
    clientName: "Tycoons",
    company: "Tycoons",
    rating: 5,
    quote: "Delivered a luxurious, high-end design for our venue. Their execution team is highly skilled and professional.",
    order: 7,
  },
  {
    clientName: "Chai Kada",
    company: "Chai Kada",
    rating: 5,
    quote: "A charming cafe ambiance built with organic textures and natural lighting. Extremely satisfied with their design approach.",
    order: 8,
  },
  {
    clientName: "Cleaniac India Pvt. Ltd.",
    company: "Cleaniac India Pvt. Ltd.",
    rating: 5,
    quote: "Lumina executed our corporate office interiors with a sleek, minimalist design that boosts productivity and matches our brand.",
    order: 9,
  },
  {
    clientName: "KMT Equipment Rental (KSA)",
    company: "KMT Equipment Rental (KSA)",
    rating: 5,
    quote: "Professional construction management and architectural planning for our facilities. Reliable partner for large-scale operations.",
    order: 10,
  },
  {
    clientName: "Amplitude Manpower Supplies (KSA)",
    company: "Amplitude Manpower Supplies (KSA)",
    rating: 5,
    quote: "Outstanding design and build execution for our corporate office. The space feels extremely professional and premium.",
    order: 11,
  },
  {
    clientName: "Apsara Group",
    company: "Apsara Group",
    rating: 5,
    quote: "Turnkey retail interior execution delivered to the highest standards. Their team possesses great design sensibility.",
    order: 12,
  },
];

async function seedTestimonials() {
  await prisma.testimonial.deleteMany({});
  for (const item of SEED_TESTIMONIALS) {
    await prisma.testimonial.create({
      data: {
        clientName: item.clientName,
        company: item.company,
        rating: item.rating,
        quote: item.quote,
        order: item.order,
        isFeatured: true,
        isPublished: true,
      },
    });
  }
}

const SEED_FAQS = [
  {
    question: "What services does Lumina Spaces provide?",
    answer: "We provide residential interiors, commercial interiors, hospitality interiors, civil construction, turnkey execution, fabrication works, steel structures, maintenance services and architectural planning.",
    order: 1,
  },
  {
    question: "Do you handle turnkey interior projects?",
    answer: "Yes. We provide complete turnkey solutions from planning and design to execution and project handover.",
    order: 2,
  },
  {
    question: "Do you undertake commercial projects?",
    answer: "Yes. We execute office interiors, retail spaces, hospitality projects and commercial construction projects.",
    order: 3,
  },
  {
    question: "Which cities do you serve?",
    answer: "We primarily serve Mangalore, Bangalore and nearby regions while also handling projects across India depending on project requirements.",
    order: 4,
  },
  {
    question: "How long does a project take?",
    answer: "Project duration depends on the scale and scope, but we always strive to deliver within the committed timeline.",
    order: 5,
  },
  {
    question: "Can I request a consultation?",
    answer: "Yes. You can contact us through the website or schedule a consultation to discuss your project requirements.",
    order: 6,
  },
  {
    question: "Do you provide construction along with interiors?",
    answer: "Yes. We provide complete civil construction along with premium interior execution.",
    order: 7,
  },
  {
    question: "Do you provide customized solutions?",
    answer: "Every project is customized according to the client's vision, budget and functional requirements.",
    order: 8,
  },
];

async function seedFaqs() {
  for (const item of SEED_FAQS) {
    const existing = await prisma.faq.findFirst({ where: { question: item.question } });
    if (!existing) {
      await prisma.faq.create({
        data: {
          question: item.question,
          answer: item.answer,
          order: item.order,
          isPublished: true,
        },
      });
    }
  }
}

async function seedSuperAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@lumina.local";
  await prisma.user.upsert({
    where: { email },
    update: { role: UserRole.SUPER_ADMIN, isActive: true },
    create: {
      email,
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });
}

async function main() {
  console.log("Seeding Lumina database…");
  await seedPermissions();
  await seedSingletons();
  await seedServices();
  await seedClients();
  await seedBeforeAfter();
  await seedTestimonials();
  await seedFaqs();
  await seedSuperAdmin();
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
