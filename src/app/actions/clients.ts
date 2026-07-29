"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createClientBrandAction(data: { name: string; websiteUrl?: string; logoUrl?: string; description?: string }) {
  try {
    const count = await db.brand.count();
    const brand = await db.brand.create({
      data: {
        name: data.name,
        websiteUrl: data.websiteUrl || null,
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        order: count + 1,
        isActive: true,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, brand };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create client brand." };
  }
}

export async function updateClientBrandAction(id: string, data: { name?: string; websiteUrl?: string; logoUrl?: string; description?: string; isActive?: boolean; order?: number }) {
  try {
    const brand = await db.brand.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.websiteUrl !== undefined ? { websiteUrl: data.websiteUrl || null } : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl || null } : {}),
        ...(data.description !== undefined ? { description: data.description || null } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.order !== undefined ? { order: data.order } : {}),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, brand };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update client brand." };
  }
}

export async function deleteClientBrandAction(id: string) {
  try {
    await db.brand.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete client brand." };
  }
}
