"use server";

import { db } from "@/lib/db";
import { rentalItems } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createRentalItem(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  await db.insert(rentalItems).values({ name, price, stock });

  revalidatePath("/admin/sewa");
  revalidatePath("/admin/transaksi");
}
