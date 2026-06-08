"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import {
  applicationStatusLabels as statusLabels,
  familyStatusLabels,
  positionLabels
} from "@/lib/status-map";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  applied_position: string | null;
  status: string;
  created_at: string;
};

type FamilyLead = {
  id: string;
  family_name: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  primary_contact_email: string | null;
  city: string | null;
  district: string | null;
  status: string;
  created_at: string;
};

export default function ApplicationsPage() {
  const [tab, setTab] = useState<"nanny" | "family">("nanny");

  const [nannyItems, setNannyItems] = useState<Application[]>([]);
  const [familyItems, setFamilyItems] = useState<FamilyLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nanny, family] = await Promise.all([
        apiFetch<Application[]>(`/applications?page=1&limit=100`),
        apiFetch<FamilyLead[]>(`/families?page=1&limit=100&status=LEAD`)
      ]);
      setNannyItems(nanny);
      setFamilyItems(family);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Veriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [nanny, family] = await Promise.all([
          apiFetch<Application[]>(`/applications?page=1&limit=100`),
          apiFetch<FamilyLead[]>(`/families?page=1&limit=100&status=LEAD`)
        ]);
        if (mounted) {
          setNannyItems(nanny);
          setFamilyItems(family);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Veriler alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  const runAction = async (id: string, action: "convert" | "reject" | "duplicate") => {
    const pathMap = {
      convert: `/applications/${id}/convert-to-candidate`,
      reject: `/applications/${id}/reject`,
      duplicate: `/applications/${id}/mark-duplicate`
    } as const;
    try {
      setError(null);
      await apiFetch(pathMap[action], { method: "POST" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aksiyon başarısız.");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    try {
      setError(null);
      await apiFetch(`/applications/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru silinemedi.");
    }
  };

  const filteredNanny = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("tr");
    if (!query) return nannyItems;
    return nannyItems.filter((item) =>
      `${item.first_name} ${item.last_name} ${item.phone} ${item.email ?? ""} ${item.applied_position ?? ""}`.toLocaleLowerCase("tr").includes(query)
    );
  }, [nannyItems, q]);

  const filteredFamily = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("tr");
    if (!query) return familyItems;
    return familyItems.filter((item) =>
      `${item.family_name} ${item.primary_contact_name} ${item.primary_contact_phone} ${item.primary_contact_email ?? ""}`.toLocaleLowerCase("tr").includes(query)
    );
  }, [familyItems, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Başvurular</h2>
        <span className="text-sm text-slate-500">
          {tab === "nanny" ? nannyItems.length : familyItems.length} kayıt
        </span>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("nanny")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "nanny" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Dadı Başvuruları
          {nannyItems.length > 0 && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {nannyItems.filter(i => i.status === "NEW").length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("family")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "family" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Aile Başvuruları
          {familyItems.length > 0 && (
            <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
              {familyItems.length}
            </span>
          )}
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ad, telefon veya e-posta ile ara"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error && tab === "nanny" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Pozisyon</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredNanny.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/applications/${item.id}`} className="font-medium text-[var(--brand)]">
                      {item.first_name} {item.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">
                    {item.applied_position
                      ? positionLabels[item.applied_position] ?? item.applied_position
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{item.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {statusLabels[item.status] ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => runAction(item.id, "convert")}>
                        Adaya Dönüştür
                      </button>
                      <button type="button" className="rounded border border-red-200 px-2 py-1 text-xs text-red-600" onClick={() => runAction(item.id, "reject")}>
                        Reddet
                      </button>
                      <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => runAction(item.id, "duplicate")}>
                        Mükerrer
                      </button>
                      <button type="button" className="rounded border border-red-200 px-2 py-1 text-xs text-red-600" onClick={() => remove(item.id)}>
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNanny.length === 0 ? (
                <tr><td className="px-4 py-5 text-slate-500" colSpan={6}>Kayit bulunamadi.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && !error && tab === "family" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Aile Adı</th>
                <th className="px-4 py-3">İletişim</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Şehir</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamily.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.family_name}</td>
                  <td className="px-4 py-3">{item.primary_contact_name}</td>
                  <td className="px-4 py-3">{item.primary_contact_phone}</td>
                  <td className="px-4 py-3">{item.city ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                      {familyStatusLabels[item.status] ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/families/${item.id}`} className="rounded border border-slate-300 px-2 py-1 text-xs">
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredFamily.length === 0 ? (
                <tr><td className="px-4 py-5 text-slate-500" colSpan={6}>Yeni aile başvurusu yok.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

