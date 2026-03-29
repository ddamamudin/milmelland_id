"use server";

import { db } from "@/lib/db";
import { rentalItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createRentalItem(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  await db.insert(rentalItems).values({ name, price, stock });

  revalidatePath("/admin/sewa");
  revalidatePath("/admin/transaksi");
}

export async function updateRentalItem(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  await db
    .update(rentalItems)
    .set({ name, price, stock })
    .where(eq(rentalItems.id, id));

  revalidatePath("/admin/sewa");
  revalidatePath("/admin/transaksi");
}

export async function deleteRentalItem(id: string) {
  await db.delete(rentalItems).where(eq(rentalItems.id, id));

  revalidatePath("/admin/sewa");
  revalidatePath("/admin/transaksi");
}

export async function toggleRentalItem(id: string, isActive: boolean) {
  await db
    .update(rentalItems)
    .set({ isActive })
    .where(eq(rentalItems.id, id));

  revalidatePath("/admin/sewa");
  revalidatePath("/admin/transaksi");
}
