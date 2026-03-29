"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Milmelland"
            width={72}
            height={72}
            className="rounded-xl mb-4"
          />
          <h1 className="text-2xl font-bold text-primary">Milmelland</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@milmelland.id"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-light text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; 2026 Milmelland.id
        </p>
      </div>
    </div>
  );
}
