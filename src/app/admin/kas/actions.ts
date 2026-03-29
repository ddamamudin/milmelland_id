"use server";

import { db } from "@/lib/db";
import { cashCategories, cashEntries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCashEntry(formData: FormData) {
  const type = formData.get("type") as "masuk" | "keluar";
  const categoryId = formData.get("categoryId") as string;
  const amount = parseInt(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;

  await db.insert(cashEntries).values({
    type,
    categoryId: categoryId || null,
    amount,
    description,
    date,
  });

  revalidatePath("/admin/kas");
}

export async function updateCashEntry(id: string, formData: FormData) {
  const type = formData.get("type") as "masuk" | "keluar";
  const categoryId = formData.get("categoryId") as string;
  const amount = parseInt(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;

  await db
    .update(cashEntries)
    .set({
      type,
      categoryId: categoryId || null,
      amount,
      description,
      date,
    })
    .where(eq(cashEntries.id, id));

  revalidatePath("/admin/kas");
}

export async function deleteCashEntry(id: string) {
  await db.delete(cashEntries).where(eq(cashEntries.id, id));

  revalidatePath("/admin/kas");
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as "masuk" | "keluar";

  await db.insert(cashCategories).values({
    name,
    type,
  });

  revalidatePath("/admin/kas");
  revalidatePath("/admin/kas/kategori");
}

export async function deleteCategory(id: string) {
  // Set categoryId to null on entries using this category
  await db
    .update(cashEntries)
    .set({ categoryId: null })
    .where(eq(cashEntries.categoryId, id));

  await db.delete(cashCategories).where(eq(cashCategories.id, id));

  revalidatePath("/admin/kas");
  revalidatePath("/admin/kas/kategori");
}
