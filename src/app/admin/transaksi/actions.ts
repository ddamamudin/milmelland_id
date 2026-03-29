"use server";

import { db } from "@/lib/db";
import { transactions, transactionItems } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

function generateInvoiceNo() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MML-${date}-${rand}`;
}

type CartItem = {
  ticketTypeId?: string;
  rentalItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export async function createTransaction(items: CartItem[]) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const [tx] = await db
    .insert(transactions)
    .values({
      invoiceNo: generateInvoiceNo(),
      totalAmount,
      status: "success",
    })
    .returning();

  await db.insert(transactionItems).values(
    items.map((item) => ({
      transactionId: tx.id,
      ticketTypeId: item.ticketTypeId || null,
      rentalItemId: item.rentalItemId || null,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.unitPrice * item.quantity,
    }))
  );

  revalidatePath("/admin/transaksi");
  revalidatePath("/admin");

  return { invoiceNo: tx.invoiceNo, totalAmount };
}
