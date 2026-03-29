"use server";

import { db } from "@/lib/db";
import { facilities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFacility(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as "aktif" | "maintenance" | "tutup";

  await db.insert(facilities).values({ name, description, status });

  revalidatePath("/admin/fasilitas");
}

export async function updateFacility(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as "aktif" | "maintenance" | "tutup";

  await db
    .update(facilities)
    .set({ name, description, status, updatedAt: new Date() })
    .where(eq(facilities.id, id));

  revalidatePath("/admin/fasilitas");
}

export async function deleteFacility(id: string) {
  await db.delete(facilities).where(eq(facilities.id, id));

  revalidatePath("/admin/fasilitas");
}
