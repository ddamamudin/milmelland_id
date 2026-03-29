import { db } from "@/lib/db";
import { ticketTypes } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { TicketForm } from "./ticket-form";
import { TicketRowActions } from "./ticket-actions";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const categoryLabel: Record<string, string> = {
  dewasa: "Dewasa",
  anak: "Anak-anak",
};

const dayTypeLabel: Record<string, string> = {
  weekday: "Weekday",
  weekend: "Weekend",
  libur: "Hari Libur",
};

export default async function TiketPage() {
  const tickets = await db
    .select()
    .from(ticketTypes)
    .orderBy(sql`${ticketTypes.dayType}, ${ticketTypes.category}`);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">Manajemen Tiket</h1>
      </div>

      <TicketForm />

      <div className="bg-surface rounded-xl border border-border shadow-sm mt-6">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-lg">Daftar Harga Tiket</h2>
        </div>
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Belum ada tiket. Tambahkan tiket pertama di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted border-b border-border">
                  <th className="px-5 py-3 font-medium">Nama</th>
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-5 py-3 font-medium">Hari</th>
                  <th className="px-5 py-3 font-medium">Harga</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 text-sm font-medium">
                      {ticket.name}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      {categoryLabel[ticket.category]}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      {dayTypeLabel[ticket.dayType]}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold">
                      {formatRupiah(ticket.price)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          ticket.isActive
                            ? "bg-accent/10 text-accent"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {ticket.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <TicketRowActions ticket={ticket} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
