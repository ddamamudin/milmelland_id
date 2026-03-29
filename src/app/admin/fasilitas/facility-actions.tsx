"use client";

import { useState, useTransition } from "react";
import { updateFacility, deleteFacility } from "./actions";

interface Facility {
  id: string;
  name: string;
  description: string | null;
  status: "aktif" | "maintenance" | "tutup";
}

const statusStyle: Record<string, string> = {
  aktif: "bg-accent/10 text-accent",
  maintenance: "bg-yellow-100 text-yellow-600",
  tutup: "bg-red-100 text-red-600",
};

const statusLabel: Record<string, string> = {
  aktif: "Aktif",
  maintenance: "Maintenance",
  tutup: "Tutup",
};

export function FacilityActions({ facility }: { facility: Facility }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Hapus fasilitas "${facility.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    startTransition(async () => {
      await deleteFacility(facility.id);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateFacility(facility.id, formData);
      setIsEditing(false);
    });
  }

  if (isEditing) {
    return (
      <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
        <form action={handleUpdate}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Nama</label>
              <input
                name="name"
                defaultValue={facility.name}
                required
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Deskripsi</label>
              <input
                name="description"
                defaultValue={facility.description ?? ""}
                placeholder="Opsional"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Status</label>
              <select
                name="status"
                defaultValue={facility.status}
                required
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="aktif">Aktif</option>
                <option value="maintenance">Maintenance</option>
                <option value="tutup">Tutup</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary-light text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="bg-surface hover:bg-background border border-border px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{facility.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[facility.status]}`}
        >
          {statusLabel[facility.status]}
        </span>
      </div>
      {facility.description && (
        <p className="text-sm text-muted">{facility.description}</p>
      )}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          className="text-primary hover:text-primary-dark text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
