import { db } from "@/lib/db";
import { rentalItems } from "@/lib/db/schema";
import { RentalForm } from "./rental-form";
import { RentalRowActions } from "./rental-actions";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function SewaPage() {
  const items = await db
    .select()
    .from(rentalItems)
    .orderBy(rentalItems.name);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-6">
        Sewa & Rental
      </h1>

      <RentalForm />

      <div className="bg-surface rounded-xl border border-border shadow-sm mt-6">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-lg">Daftar Item Sewa</h2>
        </div>
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Belum ada item sewa. Tambahkan di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted border-b border-border">
                  <th className="px-5 py-3 font-medium">Nama</th>
                  <th className="px-5 py-3 font-medium">Harga</th>
                  <th className="px-5 py-3 font-medium">Stok</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-5 py-3 text-sm font-semibold">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-5 py-3 text-sm">{item.stock} unit</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.isActive
                            ? "bg-accent/10 text-accent"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <RentalRowActions item={item} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
