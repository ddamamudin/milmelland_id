"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/admin/login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/tiket", label: "Manajemen Tiket", icon: "🎫" },
  { href: "/admin/transaksi", label: "Transaksi", icon: "💰" },
  { href: "/admin/sewa", label: "Sewa & Rental", icon: "🛟" },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: "🏊" },
  { href: "/admin/laporan", label: "Laporan", icon: "📈" },
  { href: "/admin/kas", label: "Buku Kas", icon: "📒" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Image src="/logo.png" alt="Milmelland" width={40} height={40} className="rounded-lg" />
        <div>
          <h1 className="font-bold text-lg leading-tight">Milmelland</h1>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white font-medium"
                  : "text-white/70 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-2">
        <button
          onClick={() => startTransition(() => logout())}
          disabled={isPending}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          <span className="text-lg">🚪</span>
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>

      <div className="p-4 border-t border-white/10 text-xs text-white/40">
        &copy; 2026 Milmelland.id
      </div>
    </aside>
  );
}
