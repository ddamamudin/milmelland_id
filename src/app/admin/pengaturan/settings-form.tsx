"use client";

import { useState } from "react";
import { updateSettings } from "./actions";

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }
    await updateSettings(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {saved && (
        <div className="bg-accent/10 text-accent text-sm p-3 rounded-lg font-medium">
          Pengaturan berhasil disimpan!
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-4">Profil Usaha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Nama Usaha
            </label>
            <input
              name="business_name"
              defaultValue={settings.business_name}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              No. Telepon
            </label>
            <input
              name="phone"
              defaultValue={settings.phone}
              placeholder="08xx-xxxx-xxxx"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted mb-1">
              Alamat
            </label>
            <input
              name="address"
              defaultValue={settings.address}
              placeholder="Alamat lengkap"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-4">Jam Operasional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Jam Buka
            </label>
            <input
              name="open_time"
              type="time"
              defaultValue={settings.open_time}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Jam Tutup
            </label>
            <input
              name="close_time"
              type="time"
              defaultValue={settings.close_time}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-4">Pajak</h2>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-muted mb-1">
            Pajak (%)
          </label>
          <input
            name="tax_percent"
            type="number"
            min={0}
            max={100}
            defaultValue={settings.tax_percent}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Simpan Pengaturan
      </button>
    </form>
  );
}
