import { db } from "@/lib/db";
import { facilities } from "@/lib/db/schema";
import { FasilitasForm } from "./fasilitas-form";
import { FacilityActions } from "./facility-actions";

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
            <FacilityActions
              key={f.id}
              facility={f}
            />
          ))
        )}
      </div>
    </div>
  );
}
