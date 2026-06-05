"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  roles?: string[];
};

type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  permissions: Array<{ id: string; key: string }>;
};

type StatusGuide = {
  familyStatuses: Array<{ key: string; label: string; description: string }>;
  familyRequestStatuses: Array<{ key: string; next: string[] }>;
};

type CreateUserForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  status: "ACTIVE" | "INVITED" | "DISABLED";
  role_ids: string[];
};

const initialForm: CreateUserForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  status: "ACTIVE",
  role_ids: []
};

export default function UsersSettingsPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [guide, setGuide] = useState<StatusGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [form, setForm] = useState<CreateUserForm>(initialForm);

  const loadAll = async () => {
    const [usersData, rolesData, statusGuide] = await Promise.all([
      apiFetch<UserRow[]>("/users"),
      apiFetch<RoleRow[]>("/roles"),
      apiFetch<StatusGuide>("/settings/status-guide")
    ]);
    setRows(usersData);
    setRoles(rolesData);
    setGuide(statusGuide);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await loadAll();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Ayarlar verisi alınamadı.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInfo(null);

    if (form.role_ids.length === 0) {
      setError("En az bir rol seçmelisiniz.");
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await apiFetch<UserRow>("/users", {
        method: "POST",
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone.trim() ? form.phone : undefined,
          password: form.password,
          status: form.status,
          role_ids: form.role_ids
        })
      });

      await loadAll();
      setForm(initialForm);
      setInfo("Kullanıcı oluşturuldu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kullanıcı oluşturulamadı.");
    } finally {
      setBusy(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setForm((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  };

  const runDemoReseed = async () => {
    if (!window.confirm("Demo verileri yeniden üretilecek. Devam edilsin mi?")) {
      return;
    }

    try {
      setBusy(true);
      setError(null);
      const result = await apiFetch<{ success: boolean; output: string }>("/settings/demo/reseed", {
        method: "POST"
      });
      await loadAll();
      setInfo(result.output || "Demo veriler yenilendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo reseed başarısız.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Ayarlar / Kullanıcı ve Yetki</h2>

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p> : null}

      {!loading ? (
        <>
          <section className="surface rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Kullanıcı Oluştur</h3>
              <button
                type="button"
                disabled={busy}
                onClick={runDemoReseed}
                className="btn-ghost rounded-xl px-3 py-2 text-sm"
              >
                Demo Veriyi Yenile
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-2">
              <input
                value={form.first_name}
                onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                placeholder="Ad"
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
                required
              />
              <input
                value={form.last_name}
                onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                placeholder="Soyad"
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
                required
              />
              <input
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                type="email"
                placeholder="E-posta"
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
                required
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Telefon (opsiyonel)"
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
              />
              <input
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                type="password"
                placeholder="Şifre"
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
                minLength={8}
                required
              />
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as CreateUserForm["status"]
                  }))
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="DISABLED">DISABLED</option>
              </select>

              <div className="lg:col-span-2 rounded-xl border border-[var(--line)] bg-white p-3">
                <p className="mb-2 text-sm font-semibold">Yetkiler (Rol Seçimi)</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.role_ids.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block font-semibold">{role.name}</span>
                        <span className="text-xs text-slate-500">{role.description ?? "Açıklama yok"}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <button type="submit" disabled={busy} className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold">
                  {busy ? "Kaydediliyor..." : "Kullanıcı Oluştur"}
                </button>
              </div>
            </form>
          </section>

          <section className="surface rounded-2xl p-4">
            <h3 className="mb-3 text-lg font-semibold">Kullanıcı Listesi</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Ad Soyad</th>
                    <th className="px-4 py-3">E-posta</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Roller</th>
                    <th className="px-4 py-3">Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{row.first_name} {row.last_name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.status}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{row.roles?.join(", ") || "-"}</td>
                      <td className="px-4 py-3">{new Date(row.created_at).toLocaleDateString("tr-TR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {guide ? (
            <section className="surface rounded-2xl p-4">
              <h3 className="mb-3 text-lg font-semibold">Durum Rehberi</h3>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="mb-2 text-sm font-semibold">Aile Durumları</p>
                  <ul className="space-y-2 text-sm">
                    {guide.familyStatuses.map((status) => (
                      <li key={status.key}>
                        <span className="font-semibold">{status.key}</span>: {status.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="mb-2 text-sm font-semibold">Talep Geçiş Kuralları</p>
                  <ul className="space-y-2 text-sm">
                    {guide.familyRequestStatuses.map((status) => (
                      <li key={status.key}>
                        <span className="font-semibold">{status.key}</span> → {status.next.length ? status.next.join(", ") : "Final"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          <section className="surface rounded-2xl p-4">
            <h3 className="mb-2 text-lg font-semibold">Rol Özeti</h3>
            <div className="grid gap-3 lg:grid-cols-2">
              {roles.map((role) => (
                <div key={role.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-semibold">{role.name}</p>
                  <p className="text-xs text-slate-500">{role.description ?? "Açıklama yok"}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    {role.permissions.slice(0, 6).map((permission) => permission.key).join(", ")}
                    {role.permissions.length > 6 ? " ..." : ""}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Full yetki için "Owner" veya "Admin", kısıtlı kullanım için "Staff", "Finance" veya "ReadOnly" rollerini ver.
            </p>
          </section>
        </>
      ) : null}
    </div>
  );
}
