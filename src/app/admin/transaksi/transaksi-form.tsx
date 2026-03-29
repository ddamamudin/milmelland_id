"use client";

import { useState } from "react";
import { createTransaction } from "./actions";

type Ticket = {
  id: string;
  name: string;
  price: number;
  category: string;
  dayType: string;
};

type Rental = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  ticketTypeId?: string;
  rentalItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function TransaksiForm({
  tickets,
  rentals,
}: {
  tickets: Ticket[];
  rentals: Rental[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  function addTicket(ticket: Ticket) {
    const existing = cart.find((i) => i.ticketTypeId === ticket.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.ticketTypeId === ticket.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ticketTypeId: ticket.id,
          description: ticket.name,
          quantity: 1,
          unitPrice: ticket.price,
        },
      ]);
    }
  }

  function addRental(rental: Rental) {
    const existing = cart.find((i) => i.rentalItemId === rental.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.rentalItemId === rental.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          rentalItemId: rental.id,
          description: rental.name,
          quantity: 1,
          unitPrice: rental.price,
        },
      ]);
    }
  }

  function removeItem(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (cart.length === 0) return;
    const result = await createTransaction(cart);
    setCart([]);
    setSuccess(
      `Transaksi ${result.invoiceNo} berhasil! Total: ${formatRupiah(result.totalAmount)}`
    );
    setTimeout(() => setSuccess(null), 5000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Pilih item */}
      <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-4">Pilih Item</h2>

        {tickets.length > 0 && (
          <>
            <p className="text-sm font-medium text-muted mb-2">Tiket Masuk</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addTicket(t)}
                  className="text-left border border-border rounded-lg p-3 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.category} &middot; {t.dayType}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatRupiah(t.price)}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {rentals.length > 0 && (
          <>
            <p className="text-sm font-medium text-muted mb-2">Sewa / Rental</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {rentals.map((r) => (
                <button
                  key={r.id}
                  onClick={() => addRental(r)}
                  className="text-left border border-border rounded-lg p-3 hover:border-secondary hover:bg-secondary/5 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-sm font-bold text-secondary mt-1">
                    {formatRupiah(r.price)}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {tickets.length === 0 && rentals.length === 0 && (
          <p className="text-muted text-sm">
            Belum ada tiket atau item sewa. Tambahkan di halaman Manajemen Tiket terlebih dahulu.
          </p>
        )}
      </div>

      {/* Keranjang */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-5 flex flex-col">
        <h2 className="font-semibold text-lg mb-4">Keranjang</h2>

        {success && (
          <div className="bg-accent/10 text-accent text-sm p-3 rounded-lg mb-3 font-medium">
            {success}
          </div>
        )}

        <div className="flex-1">
          {cart.length === 0 ? (
            <p className="text-muted text-sm">Keranjang kosong.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border-b border-border pb-2"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-xs text-muted">
                      {item.quantity}x {formatRupiah(item.unitPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-red-400 hover:text-red-600 text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg mb-3">
            <span>Total</span>
            <span className="text-primary">{formatRupiah(total)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={cart.length === 0}
            className="w-full bg-accent hover:bg-accent-light disabled:bg-border text-white py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
