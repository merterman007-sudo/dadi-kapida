import { Injectable, NotFoundException } from "@nestjs/common";
import { ExpenseStatus, ExpenseType, PaymentStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

type FinanceTrendPoint = {
  date: string;
  label: string;
  collected: number;
  refunded: number;
  net: number;
};

type ExpenseRow = {
  id: string;
  type: ExpenseType;
  candidate_id: string | null;
  candidate_name: string | null;
  candidate_code: string | null;
  family_id: string | null;
  family_name: string | null;
  placement_id: string | null;
  title: string;
  category: string | null;
  amount: Prisma.Decimal;
  currency: string;
  paid_at: Date | null;
  status: ExpenseStatus;
  method: string | null;
  transaction_ref: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  listInvoices(page = 1, limit = 20) {
    return this.prisma.invoice.findMany({
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  createInvoice(dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        ...dto,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined
      }
    });
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto) {
    await this.ensureInvoiceExists(id);
    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...dto,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined
      }
    });
  }

  async markInvoicePaid(id: string) {
    await this.ensureInvoiceExists(id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status: PaymentStatus.PAID }
    });
  }

  listPayments(page = 1, limit = 20) {
    return this.prisma.payment.findMany({
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async listExpenses(page = 1, limit = 20) {
    const expenses = await this.prisma.expense.findMany({
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });

    const candidateIds = [...new Set(expenses.map((expense) => expense.candidate_id).filter(Boolean))] as string[];
    const familyIds = [...new Set(expenses.map((expense) => expense.family_id).filter(Boolean))] as string[];

    const [candidates, families] = await Promise.all([
      candidateIds.length > 0
        ? this.prisma.candidate.findMany({
            where: { id: { in: candidateIds } },
            select: { id: true, first_name: true, last_name: true, candidate_code: true }
          })
        : Promise.resolve([]),
      familyIds.length > 0
        ? this.prisma.family.findMany({
            where: { id: { in: familyIds } },
            select: { id: true, family_name: true }
          })
        : Promise.resolve([])
    ]);

    const candidateMap = new Map(
      candidates.map((candidate) => [
        candidate.id,
        {
          name: `${candidate.first_name} ${candidate.last_name}`,
          code: candidate.candidate_code
        }
      ] as const)
    );
    const familyMap = new Map(families.map((family) => [family.id, family.family_name] as const));

    return expenses.map((expense): ExpenseRow => {
      const candidate = expense.candidate_id ? candidateMap.get(expense.candidate_id) ?? null : null;
      return {
        id: expense.id,
        type: expense.type,
        candidate_id: expense.candidate_id,
        candidate_name: candidate?.name ?? null,
        candidate_code: candidate?.code ?? null,
        family_id: expense.family_id,
        family_name: expense.family_id ? familyMap.get(expense.family_id) ?? null : null,
        placement_id: expense.placement_id,
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        currency: expense.currency,
        paid_at: expense.paid_at,
        status: expense.status,
        method: expense.method,
        transaction_ref: expense.transaction_ref,
        notes: expense.notes,
        created_at: expense.created_at,
        updated_at: expense.updated_at
      };
    });
  }

  createPayment(dto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...dto,
        paid_at: dto.paid_at ? new Date(dto.paid_at) : undefined
      }
    });
  }

  createExpense(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...dto,
        paid_at: dto.paid_at ? new Date(dto.paid_at) : undefined
      }
    });
  }

  async updatePayment(id: string, dto: UpdatePaymentDto) {
    await this.ensurePaymentExists(id);
    return this.prisma.payment.update({
      where: { id },
      data: {
        ...dto,
        paid_at: dto.paid_at ? new Date(dto.paid_at) : undefined
      }
    });
  }

  async updateExpense(id: string, dto: UpdateExpenseDto) {
    await this.ensureExpenseExists(id);
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        paid_at: dto.paid_at ? new Date(dto.paid_at) : undefined
      }
    });
  }

  async refundPayment(id: string) {
    await this.ensurePaymentExists(id);
    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REFUNDED }
    });
  }

  async markExpensePaid(id: string) {
    await this.ensureExpenseExists(id);
    return this.prisma.expense.update({
      where: { id },
      data: { status: ExpenseStatus.PAID, paid_at: new Date() }
    });
  }

  getStatus() {
    return { module: "finance", status: "ok" };
  }

  async trend(days = 14): Promise<FinanceTrendPoint[]> {
    const safeDays = Math.min(Math.max(Number.isFinite(days) ? days : 14, 7), 90);
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (safeDays - 1));

    const payments = await this.prisma.payment.findMany({
      where: {
        paid_at: { gte: start },
        status: { in: [PaymentStatus.PAID, PaymentStatus.REFUNDED] }
      },
      select: {
        amount: true,
        status: true,
        paid_at: true
      },
      orderBy: { paid_at: "asc" }
    });

    const rows: FinanceTrendPoint[] = [];
    const map = new Map<string, FinanceTrendPoint>();

    for (let i = 0; i < safeDays; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const isoDate = d.toISOString().slice(0, 10);
      const row: FinanceTrendPoint = {
        date: isoDate,
        label: d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
        collected: 0,
        refunded: 0,
        net: 0
      };
      rows.push(row);
      map.set(isoDate, row);
    }

    for (const payment of payments) {
      if (!payment.paid_at) continue;
      const key = payment.paid_at.toISOString().slice(0, 10);
      const row = map.get(key);
      if (!row) continue;
      const amount = Number(payment.amount);
      if (payment.status === PaymentStatus.PAID) row.collected += amount;
      if (payment.status === PaymentStatus.REFUNDED) row.refunded += amount;
      row.net = row.collected - row.refunded;
    }

    return rows;
  }

  async sendOverdueReminder(invoiceId: string, actorUserId?: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        amount: true,
        status: true,
        due_date: true,
        family_id: true
      }
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue =
      invoice.status !== PaymentStatus.PAID &&
      invoice.due_date !== null &&
      invoice.due_date.getTime() < today.getTime();

    if (!isOverdue) {
      return {
        reminded: false,
        reason: "INVOICE_NOT_OVERDUE",
        invoiceId: invoice.id
      };
    }

    const family = invoice.family_id
      ? await this.prisma.family.findUnique({
          where: { id: invoice.family_id },
          select: {
            family_name: true,
            primary_contact_name: true,
            primary_contact_phone: true,
            primary_contact_email: true
          }
        })
      : null;

    const dueDateText = invoice.due_date?.toLocaleDateString("tr-TR") ?? "-";
    const amountText = Number(invoice.amount).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const toValue = family?.primary_contact_email ?? family?.primary_contact_phone ?? "unknown";

    const reminderMessage = await this.prisma.message.create({
      data: {
        channel: "SYSTEM",
        direction: "OUTBOUND",
        entity_type: "invoice",
        entity_id: invoice.id,
        to_value: toValue,
        subject: "Gecikmis odeme hatirlatmasi",
        content: `Sayin ${family?.primary_contact_name ?? "Musterimiz"}, ${dueDateText} vadeli ${amountText} TL tutarli odemeniz gecikmistir. En kisa surede odeme yapmanizi rica ederiz.`,
        sent_at: new Date(),
        created_by_user_id: actorUserId
      }
    });

    const existingFollowUpTask = await this.prisma.task.findFirst({
      where: {
        entity_type: "invoice_reminder",
        entity_id: invoice.id,
        status: { in: ["TODO", "IN_PROGRESS"] }
      },
      select: { id: true }
    });

    const followUpTask =
      existingFollowUpTask ??
      (await this.prisma.task.create({
        data: {
          title: `Fatura takip: ${invoice.id.slice(0, 8)}`,
          description: `${dueDateText} vadeli gecikmis fatura icin tahsilat takibi.`,
          status: "TODO",
          priority: 8,
          due_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          entity_type: "invoice_reminder",
          entity_id: invoice.id,
          created_by_user_id: actorUserId
        },
        select: { id: true }
      }));

    return {
      reminded: true,
      invoiceId: invoice.id,
      messageId: reminderMessage.id,
      followUpTaskId: followUpTask.id
    };
  }

  private async ensureInvoiceExists(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }
  }

  private async ensurePaymentExists(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
  }

  private async ensureExpenseExists(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }
  }
}
