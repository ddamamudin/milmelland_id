import { db } from "@/lib/db";
import { cashCategories } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { CategoryForm, CategoryDeleteButton } from "./category-form";

export default async function KategoriKasPage() {
  const categories = await db
    .select()
    .from(cashCategories)
    .orderBy(sql`${cashCategories.type}, ${cashCategories.name}`);

  const masukCategories = categories.filter((c) => c.type === "masuk");
  const keluarCategories = categories.filter((c) => c.type === "keluar");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">
          Kategori Buku Kas
        </h1>
        <Link
          href="/admin/kas"
          className="bg-surface hover:bg-background border border-border text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Kembali ke Buku Kas
        </Link>
      </div>

      {/* Add Category Form */}
      <CategoryForm />

      {/* Category Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Pemasukan Categories */}
        <div className="bg-surface rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <h2 className="font-semibold text-lg">Kategori Pemasukan</h2>
            <span className="text-sm text-muted ml-auto">
              {masukCategories.length} kategori
            </span>
          </div>
          {masukCategories.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm">
              Belum ada kategori pemasukan.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {masukCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <CategoryDeleteButton id={cat.id} name={cat.name} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pengeluaran Categories */}
        <div className="bg-surface rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h2 className="font-semibold text-lg">Kategori Pengeluaran</h2>
            <span className="text-sm text-muted ml-auto">
              {keluarCategories.length} kategori
            </span>
          </div>
          {keluarCategories.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm">
              Belum ada kategori pengeluaran.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {keluarCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <CategoryDeleteButton id={cat.id} name={cat.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
