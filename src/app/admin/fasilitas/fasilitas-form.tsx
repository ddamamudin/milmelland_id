"use client";

import { useRef } from "react";
import { createFacility } from "./actions";

export function FasilitasForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createFacility(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-surface rounded-xl border border-border shadow-sm p-5"
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Fasilitas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Nama Fasilitas
          </label>
          <input
            name="name"
            required
            placeholder="cth: Kolam Dewasa, Waterboom, Kolam Anak"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Deskripsi
          </label>
          <input
            name="description"
            placeholder="Opsional"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Status
          </label>
          <select
            name="status"
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="aktif">Aktif</option>
            <option value="maintenance">Maintenance</option>
            <option value="tutup">Tutup</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Tambah Fasilitas
      </button>
    </form>
  );
}
