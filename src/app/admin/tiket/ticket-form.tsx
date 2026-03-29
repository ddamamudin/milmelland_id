"use client";

import { createTicket } from "./actions";
import { useRef } from "react";

export function TicketForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createTicket(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-surface rounded-xl border border-border shadow-sm p-5"
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Tiket Baru</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Nama Tiket
          </label>
          <input
            name="name"
            required
            placeholder="cth: Tiket Dewasa Weekday"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Kategori
          </label>
          <select
            name="category"
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="dewasa">Dewasa</option>
            <option value="anak">Anak-anak</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Tipe Hari
          </label>
          <select
            name="dayType"
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
            <option value="libur">Hari Libur</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Harga (Rp)
          </label>
          <input
            name="price"
            type="number"
            required
            min={0}
            placeholder="25000"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Tambah Tiket
      </button>
    </form>
  );
}
