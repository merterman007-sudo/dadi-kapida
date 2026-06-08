"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type ContractTemplate = {
  id: string;
  name: string;
  body: string;
  active: boolean;
  updated_at: string;
};

type Contract = {
  id: string;
  contract_template_id: string | null;
  placement_id: string | null;
  family_id: string | null;
  candidate_id: string | null;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  created_at: string;
};

type Placement = {
  id: string;
  family_id: string;
  candidate_id: string;
  status: string;
  start_date: string;
};

const sampleTemplate = `DADI KAPIDA HİZMET VE YERLEŞTİRME SÖZLEŞMESİ

Taraflar:
1. Aile: {{family_name}}
2. Çalışan/Aday: {{candidate_name}}
3. Hizmet başlangıç tarihi: {{start_date}}
4. Anlaşılan maaş: {{agreed_salary}} TL

Kapsam:
Çalışan, ailenin ev içi çocuk bakımı ihtiyaçları doğrultusunda yatılı/gündüzlü bakım hizmeti sunar.

Operasyon Notları:
- Kimlik, referans ve gerekli evrak kontrolleri tamamlanmadan yerleştirme kesinleştirilmez.
- Deneme süreci, garanti koşulları ve ödeme planı ayrıca CRM üzerinde takip edilir.
- Tarafların özel şartları sözleşme ekinde yazılı olarak saklanır.`;

const statusLabels: Record<string, string> = {
  DRAFT: "Taslak",
  SENT: "Gönderildi",
  SIGNED: "İmzalandı",
  CANCELLED: "İptal",
  EXPIRED: "Süresi Doldu"
};

function statusClass(status: string) {
  if (status === "SIGNED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "SENT") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "CANCELLED") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function ContractsPage() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [templateName, setTemplateName] = useState("Yatılı Dadı Yerleştirme Sözleşmesi");
  const [templateBody, setTemplateBody] = useState(sampleTemplate);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedPlacementId, setSelectedPlacementId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [templateRows, contractRows, placementRows] = await Promise.all([
      apiFetch<ContractTemplate[]>("/contract-templates"),
      apiFetch<Contract[]>("/contracts?page=1&limit=100"),
      apiFetch<Placement[]>("/placements?page=1&limit=100")
    ]);

    setTemplates(templateRows);
    setContracts(contractRows);
    setPlacements(placementRows);
    setSelectedTemplateId((current) => current || templateRows[0]?.id || "");
    setSelectedPlacementId((current) => current || placementRows[0]?.id || "");
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await load();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Sözleşme verisi alınamadı.");
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

  const templateMap = useMemo(
    () => new Map(templates.map((template) => [template.id, template])),
    [templates]
  );

  const stats = useMemo(
    () => ({
      draft: contracts.filter((contract) => contract.status === "DRAFT").length,
      sent: contracts.filter((contract) => contract.status === "SENT").length,
      signed: contracts.filter((contract) => contract.status === "SIGNED").length
    }),
    [contracts]
  );

  const createTemplate = async () => {
    if (!templateName.trim() || !templateBody.trim()) return;

    try {
      setSaving(true);
      setError(null);
      await apiFetch("/contract-templates", {
        method: "POST",
        body: JSON.stringify({
          name: templateName.trim(),
          body: templateBody.trim()
        })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Şablon oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const createContract = async () => {
    if (!selectedTemplateId) return;

    const placement = placements.find((item) => item.id === selectedPlacementId);

    try {
      setSaving(true);
      setError(null);
      await apiFetch("/contracts", {
        method: "POST",
        body: JSON.stringify({
          contract_template_id: selectedTemplateId,
          placement_id: placement?.id,
          family_id: placement?.family_id,
          candidate_id: placement?.candidate_id,
          status: "DRAFT"
        })
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sözleşme oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const updateContractStatus = async (id: string, status: "SENT" | "SIGNED" | "CANCELLED") => {
    try {
      setError(null);
      if (status === "SIGNED") {
        await apiFetch(`/contracts/${id}/mark-signed`, { method: "POST" });
      } else if (status === "CANCELLED") {
        await apiFetch(`/contracts/${id}/cancel`, { method: "POST" });
      } else {
        await apiFetch(`/contracts/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status,
            sent_at: new Date().toISOString()
          })
        });
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sözleşme güncellenemedi.");
    }
  };

  const removeTemplate = async (id: string) => {
    if (!window.confirm("Bu sözleşme şablonunu silmek istediğinize emin misiniz?")) return;
    try {
      setError(null);
      await apiFetch(`/contract-templates/${id}`, { method: "DELETE" });
      setSelectedTemplateId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Şablon silinemedi.");
    }
  };

  const removeContract = async (id: string) => {
    if (!window.confirm("Bu sözleşme kaydını silmek istediğinize emin misiniz?")) return;
    try {
      setError(null);
      await apiFetch(`/contracts/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sözleşme silinemedi.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Sözleşme Operasyonu</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Şablon, Taslak ve İmza Takibi</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Burada standart sözleşme şablonları hazırlanır, yerleştirmeye bağlanır, aileye gönderilir ve imza durumu takip edilir.
        </p>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Taslak</p>
          <p className="mt-2 text-3xl font-bold">{stats.draft}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-700">Gönderildi</p>
          <p className="mt-2 text-3xl font-bold text-blue-800">{stats.sent}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">İmzalandı</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">{stats.signed}</p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Sözleşme Şablonu</h3>
              <p className="mt-1 text-xs text-slate-500">Örnek metni düzenleyip kendi standart şablonunuzu kaydedin.</p>
            </div>
            <button
              type="button"
              onClick={() => setTemplateBody(sampleTemplate)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
            >
              Örnek Metni Yükle
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            <input
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Şablon adı"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              value={templateBody}
              onChange={(event) => setTemplateBody(event.target.value)}
              rows={12}
              placeholder="Sözleşme şablonu"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={createTemplate}
              disabled={saving}
              className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Şablonu Kaydet
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold">Şablon Önizleme</h3>
          <p className="mt-1 text-xs text-slate-500">Operasyon ekibi, göndermeden önce metni buradan kontrol eder.</p>
          <div className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {templateBody}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-64 flex-1 text-sm">
            <span className="text-xs font-medium text-slate-600">Şablon</span>
            <select
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Şablon seçiniz</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {selectedTemplateId ? (
              <button
                type="button"
                onClick={() => removeTemplate(selectedTemplateId)}
                className="mt-2 rounded border border-red-200 px-2 py-1 text-xs text-red-600"
              >
                Seçili Şablonu Sil
              </button>
            ) : null}
          </label>
          <label className="min-w-64 flex-1 text-sm">
            <span className="text-xs font-medium text-slate-600">Yerleştirme</span>
            <select
              value={selectedPlacementId}
              onChange={(event) => setSelectedPlacementId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Yerleştirmeye bağlama</option>
              {placements.map((placement) => (
                <option key={placement.id} value={placement.id}>
                  {placement.id.slice(0, 8)} · {placement.status} · {new Date(placement.start_date).toLocaleDateString("tr-TR")}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={createContract}
            disabled={saving || !selectedTemplateId}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Taslak Oluştur
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Sözleşme</th>
              <th className="px-4 py-3">Şablon</th>
              <th className="px-4 py-3">Yerleştirme</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-5 text-slate-500" colSpan={6}>
                  Yükleniyor...
                </td>
              </tr>
            ) : null}
            {!loading &&
              contracts.map((contract) => (
                <tr key={contract.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs">{contract.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    {contract.contract_template_id
                      ? templateMap.get(contract.contract_template_id)?.name ?? contract.contract_template_id.slice(0, 8)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{contract.placement_id?.slice(0, 8) ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusClass(contract.status)}`}>
                      {statusLabels[contract.status] ?? contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {contract.signed_at
                      ? `İmza: ${new Date(contract.signed_at).toLocaleDateString("tr-TR")}`
                      : contract.sent_at
                        ? `Gönderim: ${new Date(contract.sent_at).toLocaleDateString("tr-TR")}`
                        : new Date(contract.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateContractStatus(contract.id, "SENT")}
                        disabled={contract.status !== "DRAFT"}
                        className="rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 disabled:opacity-40"
                      >
                        Gönderildi
                      </button>
                      <button
                        type="button"
                        onClick={() => updateContractStatus(contract.id, "SIGNED")}
                        disabled={contract.status === "SIGNED" || contract.status === "CANCELLED"}
                        className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-700 disabled:opacity-40"
                      >
                        İmzalı
                      </button>
                      <button
                        type="button"
                        onClick={() => updateContractStatus(contract.id, "CANCELLED")}
                        disabled={contract.status === "CANCELLED"}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 disabled:opacity-40"
                      >
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={() => removeContract(contract.id)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && contracts.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-slate-500" colSpan={6}>
                  Henüz sözleşme yok. Önce şablon kaydedip taslak oluşturun.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
