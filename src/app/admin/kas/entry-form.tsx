"use client";

import { useRef, useState } from "react";
import { createCashEntry } from "./actions";

interface Category {
  id: string;
  name: string;
  type: "masuk" | "keluar";
}

export function EntryForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"masuk" | "keluar">("masuk");

  const filteredCategories = categories.filter((c) => c.type === type);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(formData: FormData) {
    await createCashEntry(formData);
    formRef.current?.reset();
    setType("masuk");
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-surface rounded-xl border border-border shadow-sm p-5"
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Transaksi Kas</h2>

      {/* Type Radio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted mb-2">
          Jenis Transaksi
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="masuk"
              checked={type === "masuk"}
              onChange={() => setType("masuk")}
              className="accent-accent"
            />
            <span
              className={`text-sm font-medium ${
                type === "masuk" ? "text-accent" : "text-muted"
              }`}
            >
              Pemasukan
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="keluar"
              checked={type === "keluar"}
              onChange={() => setType("keluar")}
              className="accent-red-500"
            />
            <span
              className={`text-sm font-medium ${
                type === "keluar" ? "text-red-600" : "text-muted"
              }`}
            >
              Pengeluaran
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Kategori
          </label>
          <select
            name="categoryId"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="">-- Tanpa Kategori --</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Jumlah (Rp)
          </label>
          <input
            name="amount"
            type="number"
            required
            min={1}
            placeholder="50000"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Keterangan
          </label>
          <input
            name="description"
            type="text"
            required
            placeholder="cth: Pembelian kaporit 5kg"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Tanggal
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={today}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Simpan Transaksi
      </button>
    </form>
  );
}
