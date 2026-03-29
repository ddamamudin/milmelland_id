"use client";

import { useState, useTransition } from "react";
import { updateCashEntry, deleteCashEntry } from "./actions";

interface Category {
  id: string;
  name: string;
  type: "masuk" | "keluar";
}

interface CashEntryWithBalance {
  id: string;
  categoryId: string | null;
  type: "masuk" | "keluar";
  amount: number;
  description: string;
  date: string;
  categoryName: string | null;
  runningBalance: number;
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CashEntriesTable({
  entries,
  categories,
}: {
  entries: CashEntryWithBalance[];
  categories: Category[];
}) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm mt-6">
      <div className="p-5 border-b border-border">
        <h2 className="font-semibold text-lg">Daftar Transaksi Kas</h2>
      </div>
      {entries.length === 0 ? (
        <div className="p-8 text-center text-muted">
          Belum ada transaksi pada bulan ini. Tambahkan transaksi pertama di
          atas.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Keterangan</th>
                <th className="px-5 py-3 font-medium text-right">Masuk</th>
                <th className="px-5 py-3 font-medium text-right">Keluar</th>
                <th className="px-5 py-3 font-medium text-right">
                  Saldo Berjalan
                </th>
                <th className="px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  categories={categories}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EntryRow({
  entry,
  categories,
}: {
  entry: CashEntryWithBalance;
  categories: Category[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editType, setEditType] = useState<"masuk" | "keluar">(entry.type);

  const filteredCategories = categories.filter((c) => c.type === editType);

  function handleDelete() {
    if (
      !window.confirm(
        `Hapus transaksi "${entry.description}"? Tindakan ini tidak dapat dibatalkan.`
      )
    )
      return;
    startTransition(async () => {
      await deleteCashEntry(entry.id);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateCashEntry(entry.id, formData);
      setIsEditing(false);
    });
  }

  if (isEditing) {
    return (
      <tr className="border-b border-border bg-background/50">
        <td colSpan={7} className="px-5 py-3">
          <form action={handleUpdate}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs text-muted mb-1">Jenis</label>
                <select
                  name="type"
                  value={editType}
                  onChange={(e) =>
                    setEditType(e.target.value as "masuk" | "keluar")
                  }
                  className="w-full rounded border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="masuk">Pemasukan</option>
                  <option value="keluar">Pengeluaran</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Kategori
                </label>
                <select
                  name="categoryId"
                  defaultValue={entry.categoryId ?? ""}
                  className="w-full rounded border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">-- Tanpa Kategori --</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Jumlah (Rp)
                </label>
                <input
                  name="amount"
                  type="number"
                  defaultValue={entry.amount}
                  required
                  min={1}
                  className="w-full rounded border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Keterangan
                </label>
                <input
                  name="description"
                  type="text"
                  defaultValue={entry.description}
                  required
                  className="w-full rounded border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Tanggal
                </label>
                <input
                  name="date"
                  type="date"
                  defaultValue={entry.date}
                  required
                  className="w-full rounded border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="bg-surface hover:bg-background border border-border px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-background/50">
      <td className="px-5 py-3 text-sm">{formatDate(entry.date)}</td>
      <td className="px-5 py-3 text-sm">
        {entry.categoryName ? (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              entry.type === "masuk"
                ? "bg-accent/10 text-accent"
                : "bg-red-50 text-red-600"
            }`}
          >
            {entry.categoryName}
          </span>
        ) : (
          <span className="text-xs text-muted">-</span>
        )}
      </td>
      <td className="px-5 py-3 text-sm">{entry.description}</td>
      <td className="px-5 py-3 text-sm text-right">
        {entry.type === "masuk" ? (
          <span className="text-accent font-semibold">
            {formatRupiah(entry.amount)}
          </span>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
      <td className="px-5 py-3 text-sm text-right">
        {entry.type === "keluar" ? (
          <span className="text-red-600 font-semibold">
            {formatRupiah(entry.amount)}
          </span>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
      <td className="px-5 py-3 text-sm text-right">
        <span
          className={`font-semibold ${
            entry.runningBalance >= 0 ? "text-primary" : "text-red-600"
          }`}
        >
          {formatRupiah(entry.runningBalance)}
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}
