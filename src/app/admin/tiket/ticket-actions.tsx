"use client";

import { useState, useTransition } from "react";
import { updateTicket, deleteTicket, toggleTicket } from "./actions";

interface Ticket {
  id: string;
  name: string;
  category: "dewasa" | "anak";
  dayType: "weekday" | "weekend" | "libur";
  price: number;
  isActive: boolean;
}

export function TicketRowActions({ ticket }: { ticket: Ticket }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Hapus tiket "${ticket.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    startTransition(async () => {
      await deleteTicket(ticket.id);
    });
  }

  function handleToggle() {
    startTransition(async () => {
      await toggleTicket(ticket.id, !ticket.isActive);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateTicket(ticket.id, formData);
      setIsEditing(false);
    });
  }

  return (
    <>
      {!isEditing ? (
        <div className="flex items-center gap-2">
          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={isPending}
            title={ticket.isActive ? "Nonaktifkan" : "Aktifkan"}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
              ticket.isActive ? "bg-accent" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                ticket.isActive ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
          {/* Edit */}
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Edit
          </button>
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      ) : (
        <form action={handleUpdate} className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              name="name"
              defaultValue={ticket.name}
              required
              placeholder="Nama"
              className="rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <select
              name="category"
              defaultValue={ticket.category}
              className="rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="dewasa">Dewasa</option>
              <option value="anak">Anak-anak</option>
            </select>
            <select
              name="dayType"
              defaultValue={ticket.dayType}
              className="rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
              <option value="libur">Hari Libur</option>
            </select>
            <input
              name="price"
              type="number"
              defaultValue={ticket.price}
              required
              min={0}
              placeholder="Harga"
              className="rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-1">
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary-light text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="bg-surface hover:bg-background border border-border px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </>
  );
}
