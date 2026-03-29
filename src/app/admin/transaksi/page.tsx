import { db } from "@/lib/db";
import { transactions, transactionItems, ticketTypes, rentalItems } from "@/lib/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { TransaksiForm } from "./transaksi-form";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function TransaksiPage() {
  const tickets = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.isActive, true))
    .orderBy(ticketTypes.name);

  const rentals = await db
    .select()
    .from(rentalItems)
    .where(eq(rentalItems.isActive, true))
    .orderBy(rentalItems.name);

  const recentTx = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-6">Transaksi Baru</h1>

      <TransaksiForm
        tickets={tickets.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          category: t.category,
          dayType: t.dayType,
        }))}
        rentals={rentals.map((r) => ({
          id: r.id,
          name: r.name,
          price: r.price,
        }))}
      />

      <div className="bg-surface rounded-xl border border-border shadow-sm mt-6">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-lg">Riwayat Transaksi</h2>
        </div>
        {recentTx.length === 0 ? (
          <div className="p-8 text-center text-muted">Belum ada transaksi.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-sm font-mono">{tx.invoiceNo}</td>
                  <td className="px-5 py-3 text-sm font-semibold">
                    {formatRupiah(tx.totalAmount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tx.status === "success"
                          ? "bg-accent/10 text-accent"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {new Date(tx.createdAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
