import { db } from "@/lib/db";
import { cashEntries, cashCategories } from "@/lib/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";
import Link from "next/link";
import { EntryForm } from "./entry-form";
import { CashEntriesTable } from "./cash-entries-table";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getMonthRange(bulan: string) {
  const [year, month] = bulan.split("-").map(Number);
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

function getMonthLabel(bulan: string) {
  const [year, month] = bulan.split("-").map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function getPrevMonth(bulan: string) {
  const [year, month] = bulan.split("-").map(Number);
  const d = new Date(year, month - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getNextMonth(bulan: string) {
  const [year, month] = bulan.split("-").map(Number);
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function BukuKasPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const bulan = params.bulan || currentMonth;

  const { startDate, endDate } = getMonthRange(bulan);

  // Fetch entries for the month
  const entries = await db
    .select({
      id: cashEntries.id,
      categoryId: cashEntries.categoryId,
      type: cashEntries.type,
      amount: cashEntries.amount,
      description: cashEntries.description,
      date: cashEntries.date,
      categoryName: cashCategories.name,
    })
    .from(cashEntries)
    .leftJoin(cashCategories, eq(cashEntries.categoryId, cashCategories.id))
    .where(
      and(
        gte(cashEntries.date, startDate),
        lte(cashEntries.date, endDate)
      )
    )
    .orderBy(sql`${cashEntries.date} DESC, ${cashEntries.createdAt} DESC`);

  // Fetch all categories
  const categories = await db
    .select()
    .from(cashCategories)
    .orderBy(sql`${cashCategories.type}, ${cashCategories.name}`);

  // Calculate totals
  const totalMasuk = entries
    .filter((e) => e.type === "masuk")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalKeluar = entries
    .filter((e) => e.type === "keluar")
    .reduce((sum, e) => sum + e.amount, 0);

  const saldo = totalMasuk - totalKeluar;

  // Calculate running balance (from oldest to newest for display bottom-to-top)
  const entriesAsc = [...entries].reverse();
  let runningBalance = 0;
  const entriesWithBalance = entriesAsc.map((entry) => {
    if (entry.type === "masuk") {
      runningBalance += entry.amount;
    } else {
      runningBalance -= entry.amount;
    }
    return { ...entry, runningBalance };
  });
  // Reverse back so newest is on top
  entriesWithBalance.reverse();

  const prevMonth = getPrevMonth(bulan);
  const nextMonth = getNextMonth(bulan);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">Buku Kas</h1>
        <Link
          href="/admin/kas/kategori"
          className="bg-surface hover:bg-background border border-border text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Kelola Kategori
        </Link>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Link
          href={`/admin/kas?bulan=${prevMonth}`}
          className="p-2 rounded-lg hover:bg-surface border border-border transition-colors text-muted hover:text-primary"
          title="Bulan sebelumnya"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h2 className="text-lg font-semibold text-primary-dark min-w-[200px] text-center">
          {getMonthLabel(bulan)}
        </h2>
        <Link
          href={`/admin/kas?bulan=${nextMonth}`}
          className="p-2 rounded-lg hover:bg-surface border border-border transition-colors text-muted hover:text-primary"
          title="Bulan berikutnya"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Pemasukan */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-accent"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted">Total Pemasukan</p>
              <p className="text-xl font-bold text-accent">
                {formatRupiah(totalMasuk)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted">Total Pengeluaran</p>
              <p className="text-xl font-bold text-red-600">
                {formatRupiah(totalKeluar)}
              </p>
            </div>
          </div>
        </div>

        {/* Saldo */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted">Saldo</p>
              <p
                className={`text-xl font-bold ${
                  saldo >= 0 ? "text-primary" : "text-red-600"
                }`}
              >
                {formatRupiah(saldo)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Form */}
      <EntryForm categories={categories} />

      {/* Cash Entries Table */}
      <CashEntriesTable entries={entriesWithBalance} categories={categories} />
    </div>
  );
}
