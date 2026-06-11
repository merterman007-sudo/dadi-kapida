"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSessionStore } from "@/lib/session-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useSessionStore((state) => state.setAccessToken);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    const response = await fetch("/crm-api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    const accessToken = payload?.data?.accessToken;

    if (!response.ok || !accessToken) {
      form.setError("root", { message: payload?.error?.message ?? "Giriş başarısız." });
      return;
    }

    window.localStorage.setItem("crm_access_token", accessToken);
    setAccessToken(accessToken);
    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="surface w-full max-w-md rounded-2xl p-8 fade-up">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Dijital Operasyon</p>
        <h1 className="mt-2 text-3xl font-bold">Dadı Kapıda CRM</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Personel girişi ile devam edin.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4" autoComplete="off">
          <div>
            <label className="mb-2 block text-sm font-medium">E-posta</label>
            <input
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#8dbcf0]"
              autoComplete="off"
              placeholder="E-posta adresiniz"
              {...form.register("email")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Şifre</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#8dbcf0]"
              autoComplete="new-password"
              placeholder="Şifreniz"
              {...form.register("password")}
            />
          </div>

          {form.formState.errors.root?.message ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <button type="submit" className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
