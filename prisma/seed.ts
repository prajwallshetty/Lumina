import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Permission catalogue — the editable RBAC matrix. `key` is checked in code;
 * the Super Admin can toggle `allowed` per role from the CMS.
 */
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

// Default matrix: which roles get everything / read-only.
const FULL_ACCESS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
const roleDefaults = (key: string): UserRole[] => {
  const readOnly = key.endsWith(".view");
  const base = [...FULL_ACCESS];
  if (readOnly) base.push(UserRole.CONTENT_EDITOR, UserRole.DESIGNER, UserRole.SALES, UserRole.VIEWER);
  if (key.startsWith("blog.") || key.startsWith("portfolio.") || key.startsWith("services.") || key.startsWith("gallery.") || key.startsWith("media.") || key.startsWith("faqs.") || key.startsWith("about.") || key.startsWith("homepage.")) {
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
    update: {},
    create: { id: "singleton", companyName: "Lumina" },
  });
  await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
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
  console.log(
    `\n  Super Admin user ensured: ${email}\n  → Set a password via the sign-up flow or Better Auth admin API.\n`,
  );
}

async function main() {
  console.log("Seeding Lumina database…");
  await seedPermissions();
  await seedSingletons();
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
