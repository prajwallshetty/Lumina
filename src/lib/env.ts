import { z } from "zod";

/**
 * Validated environment. Import `env` anywhere instead of reading
 * `process.env` directly so misconfiguration fails fast and is typed.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_FOLDER: z.string().default("lumina"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Lumina"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
});

function parse<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  source: Record<string, unknown>,
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    // In development we warn but don't crash the whole dev server for optional keys.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Invalid environment variables:\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`,
      );
    }
    console.warn("[env] Some environment variables are missing or invalid.");
    return schema.partial().parse(source) as z.infer<T>;
  }
  return result.data;
}

export const env = {
  ...parse(serverSchema, process.env),
  ...parse(publicSchema, {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  }),
};
