"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type PermissionRow = {
  id: string;
  key: string;
};

type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionRow[];
};

export default function RolesSettingsPage() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<RoleRow[]>("/roles");
        if (mounted) {
          setRows(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Roller alınamadı.");
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Ayarlar / Roller</h2>
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading && !error ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Açıklama</th>
                <th className="px-4 py-3">Permission Sayısı</th>
                <th className="px-4 py-3">Permission Örnekleri</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">{row.description ?? "-"}</td>
                  <td className="px-4 py-3">{row.permissions.length}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {row.permissions.slice(0, 4).map((permission) => permission.key).join(", ") || "-"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={4}>
                    Rol bulunamadı.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
