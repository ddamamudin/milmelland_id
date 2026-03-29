"use client";

import { useRef, useTransition } from "react";
import { createCategory, deleteCategory } from "../actions";

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createCategory(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-surface rounded-xl border border-border shadow-sm p-5"
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Kategori Baru</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Nama Kategori
          </label>
          <input
            name="name"
            required
            placeholder="cth: Tiket Masuk, Gaji Staff"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Jenis
          </label>
          <select
            name="type"
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="masuk">Pemasukan</option>
            <option value="keluar">Pengeluaran</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Tambah Kategori
          </button>
        </div>
      </div>
    </form>
  );
}

export function CategoryDeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !window.confirm(
        `Hapus kategori "${name}"? Transaksi yang menggunakan kategori ini akan kehilangan kategorinya.`
      )
    )
      return;
    startTransition(async () => {
      await deleteCategory(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "..." : "Hapus"}
    </button>
  );
}
