import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const ticketCategoryEnum = pgEnum("ticket_category", [
  "dewasa",
  "anak",
]);

export const dayTypeEnum = pgEnum("day_type", [
  "weekday",
  "weekend",
  "libur",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "success",
  "cancelled",
  "refunded",
]);

export const facilityStatusEnum = pgEnum("facility_status", [
  "aktif",
  "maintenance",
  "tutup",
]);

// Jenis Tiket
export const ticketTypes = pgTable("ticket_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: ticketCategoryEnum("category").notNull(),
  dayType: dayTypeEnum("day_type").notNull(),
  price: integer("price").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transaksi
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNo: text("invoice_no").notNull().unique(),
  totalAmount: integer("total_amount").notNull(),
  status: transactionStatusEnum("status").default("success").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Item Transaksi
export const transactionItems = pgTable("transaction_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .references(() => transactions.id)
    .notNull(),
  ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id),
  rentalItemId: uuid("rental_item_id").references(() => rentalItems.id),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  subtotal: integer("subtotal").notNull(),
});

// Item Sewa (ban, pelampung, gazebo, loker)
export const rentalItems = pgTable("rental_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fasilitas (kolam, wahana, dll)
export const facilities = pgTable("facilities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: facilityStatusEnum("status").default("aktif").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enum untuk Buku Kas
export const cashTypeEnum = pgEnum("cash_type", ["masuk", "keluar"]);

// Kategori Kas
export const cashCategories = pgTable("cash_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: cashTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Entry Kas
export const cashEntries = pgTable("cash_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => cashCategories.id),
  type: cashTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pengaturan Umum
export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
