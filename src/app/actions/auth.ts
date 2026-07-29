"use server";

import { cookies } from "next/headers";

export async function loginAction(password: string) {
  if (password === "Lumina@2026") {
    const cookieStore = await cookies();
    cookieStore.set("lumina_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("lumina_admin_session");
  return { success: true };
}
