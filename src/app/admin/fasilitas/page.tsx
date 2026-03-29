import { db } from "@/lib/db";
import { facilities } from "@/lib/db/schema";
import { FasilitasForm } from "./fasilitas-form";

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

export default async function FasilitasPage() {
  const items = await db.select().from(facilities).orderBy(facilities.name);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-6">
        Manajemen Fasilitas
      </h1>

      <FasilitasForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.length === 0 ? (
          <div className="col-span-full bg-surface rounded-xl border border-border shadow-sm p-8 text-center text-muted">
            Belum ada fasilitas. Tambahkan di atas.
          </div>
        ) : (
          items.map((f) => (
            <div
              key={f.id}
              className="bg-surface rounded-xl border border-border shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{f.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[f.status]}`}
                >
                  {statusLabel[f.status]}
                </span>
              </div>
              {f.description && (
                <p className="text-sm text-muted">{f.description}</p>
              )}
              <p className="text-xs text-muted mt-3">
                Update: {new Date(f.updatedAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
