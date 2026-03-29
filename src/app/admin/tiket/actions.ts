"use server";

import { db } from "@/lib/db";
import { ticketTypes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTicket(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as "dewasa" | "anak";
  const dayType = formData.get("dayType") as "weekday" | "weekend" | "libur";
  const price = parseInt(formData.get("price") as string);

  await db.insert(ticketTypes).values({
    name,
    category,
    dayType,
    price,
  });

  revalidatePath("/admin/tiket");
}

export async function updateTicket(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as "dewasa" | "anak";
  const dayType = formData.get("dayType") as "weekday" | "weekend" | "libur";
  const price = parseInt(formData.get("price") as string);

  await db
    .update(ticketTypes)
    .set({ name, category, dayType, price, updatedAt: new Date() })
    .where(eq(ticketTypes.id, id));

  revalidatePath("/admin/tiket");
}

export async function deleteTicket(id: string) {
  await db.delete(ticketTypes).where(eq(ticketTypes.id, id));

  revalidatePath("/admin/tiket");
}

export async function toggleTicket(id: string, isActive: boolean) {
  await db
    .update(ticketTypes)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(ticketTypes.id, id));

  revalidatePath("/admin/tiket");
}
