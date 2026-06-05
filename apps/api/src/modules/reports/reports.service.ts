import { Injectable } from "@nestjs/common";
import {
  CandidateApplicationStatus,
  CandidateStatus,
  FamilyRequestStatus,
  type Prisma
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

type ReportDateFilter = {
  from?: string;
  to?: string;
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(filter: ReportDateFilter = {}) {
    const createdAt = this.buildDateRange(filter);
    const startDate = this.buildDateRange(filter);

    const [applications, candidates, families, familyRequests, placements, pendingInvoices] =
      await Promise.all([
        this.prisma.candidateApplication.count({ where: { created_at: createdAt } }),
        this.prisma.candidate.count({ where: { deleted_at: null, created_at: createdAt } }),
        this.prisma.family.count({ where: { deleted_at: null, created_at: createdAt } }),
        this.prisma.familyRequest.count({ where: { created_at: createdAt } }),
        this.prisma.placement.count({ where: { start_date: startDate } }),
        this.prisma.invoice.count({ where: { status: "PENDING", created_at: createdAt } })
      ]);

    return {
      applications,
      candidates,
      families,
      familyRequests,
      placements,
      pendingInvoices
    };
  }

  async candidates(filter: ReportDateFilter = {}) {
    const createdAt = this.buildDateRange(filter);
    const [total, approved, rejected, passive] = await Promise.all([
      this.prisma.candidate.count({ where: { deleted_at: null, created_at: createdAt } }),
      this.prisma.candidate.count({
        where: { status: CandidateStatus.APPROVED, deleted_at: null, created_at: createdAt }
      }),
      this.prisma.candidate.count({
        where: { status: CandidateStatus.REJECTED, deleted_at: null, created_at: createdAt }
      }),
      this.prisma.candidate.count({
        where: { status: CandidateStatus.PASSIVE, deleted_at: null, created_at: createdAt }
      })
    ]);

    return { total, approved, rejected, passive };
  }

  async applications(filter: ReportDateFilter = {}) {
    const createdAt = this.buildDateRange(filter);
    const [total, newCount, converted, rejected, duplicate] = await Promise.all([
      this.prisma.candidateApplication.count({ where: { created_at: createdAt } }),
      this.prisma.candidateApplication.count({
        where: { status: CandidateApplicationStatus.NEW, created_at: createdAt }
      }),
      this.prisma.candidateApplication.count({
        where: { status: CandidateApplicationStatus.CONVERTED_TO_CANDIDATE, created_at: createdAt }
      }),
      this.prisma.candidateApplication.count({
        where: { status: CandidateApplicationStatus.REJECTED, created_at: createdAt }
      }),
      this.prisma.candidateApplication.count({
        where: { status: CandidateApplicationStatus.DUPLICATE, created_at: createdAt }
      })
    ]);

    return { total, new: newCount, converted, rejected, duplicate };
  }

  async familyRequests(filter: ReportDateFilter = {}) {
    const createdAt = this.buildDateRange(filter);
    const [open, matching, shortlisted, placed] = await Promise.all([
      this.prisma.familyRequest.count({ where: { status: FamilyRequestStatus.OPEN, created_at: createdAt } }),
      this.prisma.familyRequest.count({
        where: { status: FamilyRequestStatus.MATCHING, created_at: createdAt }
      }),
      this.prisma.familyRequest.count({
        where: { status: FamilyRequestStatus.SHORTLISTED, created_at: createdAt }
      }),
      this.prisma.familyRequest.count({ where: { status: FamilyRequestStatus.PLACED, created_at: createdAt } })
    ]);

    return { open, matching, shortlisted, placed };
  }

  async placements(filter: ReportDateFilter = {}) {
    const startDate = this.buildDateRange(filter);
    const [total, active, completed, cancelled] = await Promise.all([
      this.prisma.placement.count({ where: { start_date: startDate } }),
      this.prisma.placement.count({ where: { status: "ACTIVE", start_date: startDate } }),
      this.prisma.placement.count({ where: { status: "COMPLETED", start_date: startDate } }),
      this.prisma.placement.count({ where: { status: "CANCELLED", start_date: startDate } })
    ]);

    return { total, active, completed, cancelled };
  }

  async finance(filter: ReportDateFilter = {}) {
    const createdAt = this.buildDateRange(filter);
    const [pendingInvoices, paidInvoices, totalPayments] = await Promise.all([
      this.prisma.invoice.count({ where: { status: "PENDING", created_at: createdAt } }),
      this.prisma.invoice.count({ where: { status: "PAID", created_at: createdAt } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "PAID", created_at: createdAt }
      })
    ]);

    return {
      pendingInvoices,
      paidInvoices,
      totalPaidAmount: totalPayments._sum.amount ?? 0
    };
  }

  async staffPerformance() {
    const topOwners = await this.prisma.candidate.groupBy({
      by: ["owner_user_id"],
      _count: { _all: true },
      orderBy: { _count: { owner_user_id: "desc" } },
      take: 10
    });

    return {
      topOwners
    };
  }

  getStatus() {
    return { module: "reports", status: "ok" };
  }

  private buildDateRange(filter: ReportDateFilter): Prisma.DateTimeFilter | undefined {
    const range: Prisma.DateTimeFilter = {};

    if (filter.from) {
      const from = new Date(filter.from);
      if (!Number.isNaN(from.getTime())) {
        from.setHours(0, 0, 0, 0);
        range.gte = from;
      }
    }

    if (filter.to) {
      const to = new Date(filter.to);
      if (!Number.isNaN(to.getTime())) {
        to.setHours(23, 59, 59, 999);
        range.lte = to;
      }
    }

    return Object.keys(range).length > 0 ? range : undefined;
  }
}
