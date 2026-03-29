"use server";

import { db } from "@/lib/db";
import { ticketTypes } from "@/lib/db/schema";
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
