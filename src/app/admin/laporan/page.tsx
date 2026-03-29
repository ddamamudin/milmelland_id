import { db } from "@/lib/db";
import { transactions, transactionItems } from "@/lib/db/schema";
import { sql, eq, gte, and, lte } from "drizzle-orm";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getDateRange(period: string) {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "today" } = await searchParams;
  const { start, end } = getDateRange(period);

  const [stats] = await db
    .select({
      totalTransactions: sql<number>`count(*)::int`,
      totalRevenue: sql<number>`coalesce(sum(${transactions.totalAmount}), 0)::int`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.createdAt, start),
        lte(transactions.createdAt, end),
        eq(transactions.status, "success")
      )
    );

  const [ticketStats] = await db
    .select({
      totalVisitors: sql<number>`coalesce(sum(${transactionItems.quantity}), 0)::int`,
      ticketRevenue: sql<number>`coalesce(sum(${transactionItems.subtotal}), 0)::int`,
    })
    .from(transactionItems)
    .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
    .where(
      and(
        gte(transactions.createdAt, start),
        lte(transactions.createdAt, end),
        eq(transactions.status, "success"),
        sql`${transactionItems.ticketTypeId} is not null`
      )
    );

  const [rentalStats] = await db
    .select({
      rentalCount: sql<number>`coalesce(sum(${transactionItems.quantity}), 0)::int`,
      rentalRevenue: sql<number>`coalesce(sum(${transactionItems.subtotal}), 0)::int`,
    })
    .from(transactionItems)
    .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
    .where(
      and(
        gte(transactions.createdAt, start),
        lte(transactions.createdAt, end),
        eq(transactions.status, "success"),
        sql`${transactionItems.rentalItemId} is not null`
      )
    );

  const dailyRevenue = await db
    .select({
      date: sql<string>`to_char(${transactions.createdAt}, 'YYYY-MM-DD')`,
      total: sql<number>`coalesce(sum(${transactions.totalAmount}), 0)::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.createdAt, start),
        lte(transactions.createdAt, end),
        eq(transactions.status, "success")
      )
    )
    .groupBy(sql`to_char(${transactions.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${transactions.createdAt}, 'YYYY-MM-DD') desc`)
    .limit(30);

  const periodLabels: Record<string, string> = {
    today: "Hari Ini",
    week: "7 Hari Terakhir",
    month: "30 Hari Terakhir",
    year: "1 Tahun Terakhir",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">Laporan</h1>
        <div className="flex gap-2">
          {Object.entries(periodLabels).map(([key, label]) => (
            <a
              key={key}
              href={`/admin/laporan?period=${key}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === key
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-sm text-muted mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-primary">
            {formatRupiah(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-sm text-muted mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-secondary">
            {stats.totalTransactions}
          </p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-sm text-muted mb-1">Pengunjung (Tiket)</p>
          <p className="text-2xl font-bold text-accent">
            {ticketStats.totalVisitors}
          </p>
          <p className="text-xs text-muted mt-1">
            Pendapatan: {formatRupiah(ticketStats.ticketRevenue)}
          </p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <p className="text-sm text-muted mb-1">Rental / Sewa</p>
          <p className="text-2xl font-bold text-primary-dark">
            {rentalStats.rentalCount} item
          </p>
          <p className="text-xs text-muted mt-1">
            Pendapatan: {formatRupiah(rentalStats.rentalRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-lg">Pendapatan Harian</h2>
        </div>
        {dailyRevenue.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Belum ada data di periode ini.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Jumlah Transaksi</th>
                <th className="px-5 py-3 font-medium">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {dailyRevenue.map((row) => (
                <tr
                  key={row.date}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 text-sm">
                    {new Date(row.date!).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-sm">{row.count} transaksi</td>
                  <td className="px-5 py-3 text-sm font-semibold">
                    {formatRupiah(row.total)}
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
