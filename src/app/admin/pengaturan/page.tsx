import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./settings-form";

const defaultSettings: Record<string, string> = {
  business_name: "Milmelland",
  address: "",
  phone: "",
  open_time: "08:00",
  close_time: "17:00",
  tax_percent: "0",
};

export default async function PengaturanPage() {
  const rows = await db.select().from(settings);

  const current: Record<string, string> = { ...defaultSettings };
  for (const row of rows) {
    current[row.key] = row.value;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-6">Pengaturan</h1>
      <SettingsForm settings={current} />
    </div>
  );
}
