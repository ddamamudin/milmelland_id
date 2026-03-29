"use client";

import { useRef } from "react";
import { createRentalItem } from "./actions";

export function RentalForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createRentalItem(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-surface rounded-xl border border-border shadow-sm p-5"
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Item Sewa</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Nama Item
          </label>
          <input
            name="name"
            required
            placeholder="cth: Ban Renang, Gazebo, Loker"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Harga Sewa (Rp)
          </label>
          <input
            name="price"
            type="number"
            required
            min={0}
            placeholder="15000"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Jumlah Stok
          </label>
          <input
            name="stock"
            type="number"
            required
            min={0}
            placeholder="20"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Tambah Item
      </button>
    </form>
  );
}
