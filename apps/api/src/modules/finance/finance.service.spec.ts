import { NotFoundException } from "@nestjs/common";
import { PaymentStatus } from "@prisma/client";
import { FinanceService } from "./finance.service";

describe("FinanceService", () => {
  const prisma = {
    invoice: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    payment: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    family: {
      findUnique: jest.fn()
    },
    message: {
      create: jest.fn()
    },
    task: {
      findFirst: jest.fn(),
      create: jest.fn()
    }
  };

  let service: FinanceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FinanceService(prisma as never);
  });

  it("creates invoice and maps due_date to Date", async () => {
    prisma.invoice.create.mockResolvedValue({ id: "inv_1" });

    await service.createInvoice({
      family_id: "f_1",
      amount: 15000,
      due_date: "2026-07-01",
      status: PaymentStatus.PENDING
    });

    expect(prisma.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        family_id: "f_1",
        due_date: new Date("2026-07-01")
      })
    });
  });

  it("throws NotFoundException when updating unknown invoice", async () => {
    prisma.invoice.findUnique.mockResolvedValue(null);

    await expect(
      service.updateInvoice("missing", { status: PaymentStatus.PAID })
    ).rejects.toThrow(new NotFoundException("Invoice not found"));
  });

  it("marks known payment as refunded", async () => {
    prisma.payment.findUnique.mockResolvedValue({ id: "pay_1" });
    prisma.payment.update.mockResolvedValue({
      id: "pay_1",
      status: PaymentStatus.REFUNDED
    });

    const result = await service.refundPayment("pay_1");

    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay_1" },
      data: { status: PaymentStatus.REFUNDED }
    });
    expect(result.status).toBe(PaymentStatus.REFUNDED);
  });

  it("builds finance trend rows", async () => {
    const paymentDate = new Date();
    paymentDate.setHours(10, 0, 0, 0);
    const refundDate = new Date(paymentDate);
    refundDate.setHours(12, 0, 0, 0);

    prisma.payment.findMany.mockResolvedValue([
      {
        amount: 1200,
        status: PaymentStatus.PAID,
        paid_at: paymentDate
      },
      {
        amount: 200,
        status: PaymentStatus.REFUNDED,
        paid_at: refundDate
      }
    ]);

    const rows = await service.trend(7);
    const nonZero = rows.find((row) => row.collected > 0 || row.refunded > 0);

    expect(rows).toHaveLength(7);
    expect(nonZero).toBeDefined();
    expect(nonZero).toEqual(
      expect.objectContaining({
        collected: 1200,
        refunded: 200,
        net: 1000
      })
    );
  });

  it("creates reminder message and follow-up task for overdue invoice", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    prisma.invoice.findUnique.mockResolvedValue({
      id: "inv-1",
      amount: 15000,
      status: PaymentStatus.PENDING,
      due_date: yesterday,
      family_id: "fam-1"
    });
    prisma.family.findUnique.mockResolvedValue({
      family_name: "Yilmaz",
      primary_contact_name: "Ayse",
      primary_contact_phone: "5550000000",
      primary_contact_email: null
    });
    prisma.message.create.mockResolvedValue({ id: "msg-1" });
    prisma.task.findFirst.mockResolvedValue(null);
    prisma.task.create.mockResolvedValue({ id: "task-1" });

    const result = await service.sendOverdueReminder("inv-1", "user-1");

    expect(prisma.message.create).toHaveBeenCalled();
    expect(prisma.task.create).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        reminded: true,
        messageId: "msg-1",
        followUpTaskId: "task-1"
      })
    );
  });
});
