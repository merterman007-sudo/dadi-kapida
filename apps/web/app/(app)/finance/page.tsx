"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiFetch } from "@/lib/api-client";

type Invoice = {
  id: string;
  amount: string;
  status: string;
  due_date: string | null;
};

type Payment = {
  id: string;
  amount: string;
  status: string;
  currency: string;
  method: string | null;
  paid_at: string | null;
};

type Candidate = {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
};

type Expense = {
  id: string;
  type: "CANDIDATE_PAYMENT" | "OPERATING_EXPENSE";
  candidate_id: string | null;
  candidate_name: string | null;
  candidate_code: string | null;
  family_id: string | null;
  family_name: string | null;
  placement_id: string | null;
  title: string;
  category: string | null;
  amount: string;
  currency: string;
  paid_at: string | null;
  status: "PENDING" | "PAID" | "CANCELLED";
  method: string | null;
  transaction_ref: string | null;
  notes: string | null;
};

type FinanceTrendPoint = {
  date: string;
  label: string;
  collected: number;
  refunded: number;
  net: number;
};

const money = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2
});

const invoiceStatusLabels: Record<string, string> = {
  UNPAID: "Ödenmedi",
  PAID: "Ödendi",
  OVERDUE: "Vadesi Geçti",
  CANCELLED: "İptal"
};

const paymentStatusLabels: Record<string, string> = {
  PAID: "Ödendi",
  REFUNDED: "İade Edildi",
  PENDING: "Beklemede"
};

const expenseStatusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  CANCELLED: "İptal"
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isOverdue(invoice: Invoice): boolean {
  if (invoice.status === "PAID" || !invoice.due_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(invoice.due_date).getTime() < today.getTime();
}

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [trendRows, setTrendRows] = useState<FinanceTrendPoint[]>([]);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState("TRY");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [expenseType, setExpenseType] = useState<Expense["type"]>("OPERATING_EXPENSE");
  const [expenseCandidateId, setExpenseCandidateId] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCurrency, setExpenseCurrency] = useState("TRY");
  const [expenseMethod, setExpenseMethod] = useState("BANK_TRANSFER");
  const [expenseNotes, setExpenseNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [remindingInvoiceId, setRemindingInvoiceId] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);

  const load = async () => {
    const [invoiceRows, paymentRows, expenseRows, candidateRows, trend] = await Promise.all([
      apiFetch<Invoice[]>("/finance/invoices?page=1&limit=100"),
      apiFetch<Payment[]>("/finance/payments?page=1&limit=100"),
      apiFetch<Expense[]>("/finance/expenses?page=1&limit=100"),
      apiFetch<Candidate[]>("/candidates?page=1&limit=200"),
      apiFetch<FinanceTrendPoint[]>("/finance/trend?days=14")
    ]);
    setInvoices(invoiceRows);
    setPayments(paymentRows);
    setExpenses(expenseRows);
    setCandidates(candidateRows);
    setTrendRows(trend);
  };

  useEffect(() => {
    setChartReady(true);
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [invoiceRows, paymentRows, expenseRows, candidateRows, trend] = await Promise.all([
          apiFetch<Invoice[]>("/finance/invoices?page=1&limit=100"),
          apiFetch<Payment[]>("/finance/payments?page=1&limit=100"),
          apiFetch<Expense[]>("/finance/expenses?page=1&limit=100"),
          apiFetch<Candidate[]>("/candidates?page=1&limit=200"),
          apiFetch<FinanceTrendPoint[]>("/finance/trend?days=14")
        ]);
        if (mounted) {
          setInvoices(invoiceRows);
          setPayments(paymentRows);
          setExpenses(expenseRows);
          setCandidates(candidateRows);
          setTrendRows(trend);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Finans verisi alınamadı.");
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

  const createInvoice = async () => {
    if (!invoiceAmount) return;
    try {
      setInfo(null);
      const amount = toNumber(invoiceAmount);
      if (amount <= 0) {
        setError("Fatura tutarı sıfırdan büyük olmalı.");
        return;
      }
      await apiFetch("/finance/invoices", {
        method: "POST",
        body: JSON.stringify({
          amount,
          due_date: invoiceDueDate || undefined
        })
      });
      setInvoiceAmount("");
      setInvoiceDueDate("");
      await load();
      setInfo("Fatura oluşturuldu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fatura oluşturulamadı.");
    }
  };

  const markPaid = async (id: string) => {
    try {
      setInfo(null);
      await apiFetch(`/finance/invoices/${id}/mark-paid`, { method: "POST" });
      await load();
      setInfo("Fatura ödendi olarak işaretlendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fatura güncellenemedi.");
    }
  };

  const sendReminder = async (id: string) => {
    try {
      setInfo(null);
      setRemindingInvoiceId(id);
      const result = await apiFetch<{ reminded: boolean; reason?: string }>(
        `/finance/invoices/${id}/send-reminder`,
        { method: "POST" }
      );
      await load();
      if (result.reminded) {
        setInfo("Hatırlatma gönderildi ve takip görevi oluşturuldu.");
      } else {
        setInfo("Bu fatura gecikmede değil; hatırlatma gönderilmedi.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hatırlatma gönderilemedi.");
    } finally {
      setRemindingInvoiceId(null);
    }
  };

  const createPayment = async () => {
    if (!paymentAmount) return;
    try {
      setInfo(null);
      const amount = toNumber(paymentAmount);
      if (amount <= 0) {
        setError("Ödeme tutarı sıfırdan büyük olmalı.");
        return;
      }
      await apiFetch("/finance/payments", {
        method: "POST",
        body: JSON.stringify({
          amount,
          status: "PAID",
          currency: paymentCurrency,
          method: paymentMethod
        })
      });
      setPaymentAmount("");
      setPaymentCurrency("TRY");
      setPaymentMethod("BANK_TRANSFER");
      await load();
      setInfo("Ödeme kaydı oluşturuldu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ödeme oluşturulamadı.");
    }
  };

  const createExpense = async () => {
    if (!expenseAmount || !expenseTitle) return;
    try {
      setInfo(null);
      const amount = toNumber(expenseAmount);
      if (amount <= 0) {
        setError("Gider tutarı sıfırdan büyük olmalı.");
        return;
      }
      await apiFetch("/finance/expenses", {
        method: "POST",
        body: JSON.stringify({
          type: expenseType,
          candidate_id: expenseType === "CANDIDATE_PAYMENT" ? expenseCandidateId || undefined : undefined,
          title: expenseTitle,
          category: expenseCategory || undefined,
          amount,
          currency: expenseCurrency,
          method: expenseMethod,
          notes: expenseNotes || undefined,
          status: "PENDING"
        })
      });
      setExpenseType("OPERATING_EXPENSE");
      setExpenseCandidateId("");
      setExpenseTitle("");
      setExpenseCategory("");
      setExpenseAmount("");
      setExpenseCurrency("TRY");
      setExpenseMethod("BANK_TRANSFER");
      setExpenseNotes("");
      await load();
      setInfo("Gider kaydı oluşturuldu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gider oluşturulamadı.");
    }
  };

  const refund = async (id: string) => {
    try {
      setInfo(null);
      await apiFetch(`/finance/payments/${id}/refund`, { method: "POST" });
      await load();
      setInfo("Ödeme iade edildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ödeme güncellenemedi.");
    }
  };

  const markExpensePaid = async (id: string) => {
    try {
      setInfo(null);
      await apiFetch(`/finance/expenses/${id}/mark-paid`, { method: "POST" });
      await load();
      setInfo("Gider ödendi olarak işaretlendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gider güncellenemedi.");
    }
  };

  const removeFinanceRecord = async (
    kind: "invoices" | "payments" | "expenses",
    id: string,
    label: string
  ) => {
    if (!window.confirm(`${label} kaydını silmek istediğinize emin misiniz?`)) return;
    try {
      setError(null);
      setInfo(null);
      await apiFetch(`/finance/${kind}/${id}`, { method: "DELETE" });
      await load();
      setInfo(`${label} kaydı silindi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${label} kaydı silinemedi.`);
    }
  };

  const invoiceTotals = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const unpaid = invoices
      .filter((invoice) => invoice.status !== "PAID")
      .reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const overdueCount = invoices.filter((invoice) => isOverdue(invoice)).length;
    return { total, unpaid, overdueCount };
  }, [invoices]);

  const paymentTotals = useMemo(() => {
    const collected = payments
      .filter((payment) => payment.status === "PAID")
      .reduce((sum, payment) => sum + toNumber(payment.amount), 0);
    const refunded = payments
      .filter((payment) => payment.status === "REFUNDED")
      .reduce((sum, payment) => sum + toNumber(payment.amount), 0);
    return { collected, refunded };
  }, [payments]);

  const expenseTotals = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    const paid = expenses
      .filter((expense) => expense.status === "PAID")
      .reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    const pending = expenses
      .filter((expense) => expense.status === "PENDING")
      .reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    return { total, paid, pending };
  }, [expenses]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Finans</h2>
      {loading ? <p className="text-sm text-slate-600">Yükleniyor...</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">{info}</p> : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Toplam Fatura</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{money.format(invoiceTotals.total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Tahsil Bekleyen</p>
          <p className="mt-1 text-xl font-semibold text-amber-700">{money.format(invoiceTotals.unpaid)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Vadesi Geçen</p>
          <p className="mt-1 text-xl font-semibold text-rose-700">{invoiceTotals.overdueCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Net Tahsilat</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700">
            {money.format(paymentTotals.collected - paymentTotals.refunded)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Toplam Gider</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{money.format(expenseTotals.total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Odenen Gider</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700">{money.format(expenseTotals.paid)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Bekleyen Gider</p>
          <p className="mt-1 text-xl font-semibold text-amber-700">{money.format(expenseTotals.pending)}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold">14 Günlük Tahsilat Trendi</p>
        <p className="mb-3 mt-1 text-xs text-slate-500">Tahsilat, iade ve net akış aynı grafikte.</p>
        <div className="h-56 rounded-xl bg-[linear-gradient(180deg,#f9fcff_0%,#eef6ff_100%)] p-3">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendRows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#7287a6", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7287a6", fontSize: 12 }} width={40} />
                <Tooltip
                  cursor={{ stroke: "#d9e7fb", strokeWidth: 1 }}
                  formatter={(value) => money.format(Number(value ?? 0))}
                  contentStyle={{
                    border: "1px solid #cfe0f5",
                    borderRadius: "12px",
                    background: "#ffffff"
                  }}
                />
                <Area type="monotone" dataKey="collected" stroke="#10a36a" fill="#10a36a33" strokeWidth={2} />
                <Area type="monotone" dataKey="refunded" stroke="#f97316" fill="#f9731629" strokeWidth={2} />
                <Area type="monotone" dataKey="net" stroke="#0b6bcb" fill="#0b6bcb1f" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Faturalar</h3>
          <input
            type="number"
            value={invoiceAmount}
            onChange={(event) => setInvoiceAmount(event.target.value)}
            placeholder="Yeni fatura tutarı"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={invoiceDueDate}
            onChange={(event) => setInvoiceDueDate(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void createInvoice()}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white"
          >
            Ekle
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Vade</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => {
                const overdue = isOverdue(item);
                return (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{money.format(toNumber(item.amount))}</td>
                    <td className="px-4 py-3">{invoiceStatusLabels[item.status] ?? item.status}</td>
                    <td className="px-4 py-3">
                      {item.due_date ? new Date(item.due_date).toLocaleDateString("tr-TR") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-2 py-1 text-xs"
                          onClick={() => void markPaid(item.id)}
                          disabled={item.status === "PAID"}
                        >
                          Ödendi İşaretle
                        </button>
                        <button
                          type="button"
                          className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800 disabled:opacity-50"
                          onClick={() => void sendReminder(item.id)}
                          disabled={!overdue || remindingInvoiceId === item.id}
                        >
                          {remindingInvoiceId === item.id ? "Gönderiliyor..." : "Hatırlat"}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                          onClick={() => void removeFinanceRecord("invoices", item.id, "Fatura")}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Giderler</h3>
          <select
            value={expenseType}
            onChange={(event) => setExpenseType(event.target.value as Expense["type"])}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="OPERATING_EXPENSE">Genel Gider</option>
            <option value="CANDIDATE_PAYMENT">Aday Odeme</option>
          </select>
          {expenseType === "CANDIDATE_PAYMENT" ? (
            <select
              value={expenseCandidateId}
              onChange={(event) => setExpenseCandidateId(event.target.value)}
              className="min-w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Aday seç</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.candidate_code} - {candidate.first_name} {candidate.last_name}
                </option>
              ))}
            </select>
          ) : null}
          <input
            type="text"
            value={expenseTitle}
            onChange={(event) => setExpenseTitle(event.target.value)}
            placeholder={expenseType === "CANDIDATE_PAYMENT" ? "Ödeme açıklaması" : "Gider başlığı"}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={expenseCategory}
            onChange={(event) => setExpenseCategory(event.target.value)}
            placeholder="Kategori"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={expenseAmount}
            onChange={(event) => setExpenseAmount(event.target.value)}
            placeholder="Gider tutarı"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={expenseCurrency}
            onChange={(event) => setExpenseCurrency(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            value={expenseMethod}
            onChange={(event) => setExpenseMethod(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="BANK_TRANSFER">Banka Havalesi</option>
            <option value="CREDIT_CARD">Kredi Kartı</option>
            <option value="CASH">Nakit</option>
          </select>
          <input
            type="text"
            value={expenseNotes}
            onChange={(event) => setExpenseNotes(event.target.value)}
            placeholder="Not"
            className="min-w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void createExpense()}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white"
          >
            Ekle
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Aday</th>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    {item.type === "CANDIDATE_PAYMENT" ? "Aday Odeme" : "Genel Gider"}
                  </td>
                  <td className="px-4 py-3">
                    {item.candidate_name
                      ? `${item.candidate_name}${item.candidate_code ? ` (${item.candidate_code})` : ""}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.title}</div>
                    {item.category ? <div className="text-xs text-slate-500">{item.category}</div> : null}
                  </td>
                  <td className="px-4 py-3">
                    {money.format(toNumber(item.amount))}
                    <div className="text-xs text-slate-500">{item.currency}</div>
                  </td>
                  <td className="px-4 py-3">{expenseStatusLabels[item.status] ?? item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-50"
                        onClick={() => void markExpensePaid(item.id)}
                        disabled={item.status === "PAID"}
                      >
                        Ödendi İşaretle
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                        onClick={() => void removeFinanceRecord("expenses", item.id, "Gider")}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Ödemeler</h3>
          <input
            type="number"
            value={paymentAmount}
            onChange={(event) => setPaymentAmount(event.target.value)}
            placeholder="Yeni ödeme tutarı"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={paymentCurrency}
            onChange={(event) => setPaymentCurrency(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="BANK_TRANSFER">Banka Havalesi</option>
            <option value="CREDIT_CARD">Kredi Kartı</option>
            <option value="CASH">Nakit</option>
          </select>
          <button
            type="button"
            onClick={() => void createPayment()}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white"
          >
            Ekle
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Para Birimi</th>
                <th className="px-4 py-3">Yöntem</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{item.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{money.format(toNumber(item.amount))}</td>
                  <td className="px-4 py-3">{paymentStatusLabels[item.status] ?? item.status}</td>
                  <td className="px-4 py-3">{item.currency}</td>
                  <td className="px-4 py-3">{item.method ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                        onClick={() => void refund(item.id)}
                        disabled={item.status === "REFUNDED"}
                      >
                        Iade Et
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                        onClick={() => void removeFinanceRecord("payments", item.id, "Ödeme")}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
