import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Tabel test untuk verifikasi koneksi
export const tests = pgTable("tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
