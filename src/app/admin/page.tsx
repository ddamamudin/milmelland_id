import { db } from "@/lib/db";
import { transactions, transactionItems } from "@/lib/db/schema";
import { sql, eq, gte, and } from "drizzle-orm";

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
      <p className="text-sm text-muted mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayStats] = await db
    .select({
      totalTransactions: sql<number>`count(*)::int`,
      totalRevenue: sql<number>`coalesce(sum(${transactions.totalAmount}), 0)::int`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.createdAt, today),
        eq(transactions.status, "success")
      )
    );

  const [todayVisitors] = await db
    .select({
      total: sql<number>`coalesce(sum(${transactionItems.quantity}), 0)::int`,
    })
    .from(transactionItems)
    .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
    .where(
      and(
        gte(transactions.createdAt, today),
        eq(transactions.status, "success"),
        sql`${transactionItems.ticketTypeId} is not null`
      )
    );

  const recentTransactions = await db
    .select()
    .from(transactions)
    .orderBy(sql`${transactions.createdAt} desc`)
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pengunjung Hari Ini"
          value={todayVisitors.total.toString()}
          sub="total tiket terjual"
          color="text-primary"
        />
        <StatCard
          label="Transaksi Hari Ini"
          value={todayStats.totalTransactions.toString()}
          color="text-secondary"
        />
        <StatCard
          label="Pendapatan Hari Ini"
          value={formatRupiah(todayStats.totalRevenue)}
          color="text-accent"
        />
        <StatCard
          label="Rata-rata / Transaksi"
          value={
            todayStats.totalTransactions > 0
              ? formatRupiah(
                  Math.round(
                    todayStats.totalRevenue / todayStats.totalTransactions
                  )
                )
              : "Rp 0"
          }
          color="text-primary-dark"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-lg">Transaksi Terakhir</h2>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Belum ada transaksi hari ini.
          </div>
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
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-sm font-mono">
                    {tx.invoiceNo}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold">
                    {formatRupiah(tx.totalAmount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tx.status === "success"
                          ? "bg-accent/10 text-accent"
                          : tx.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
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
