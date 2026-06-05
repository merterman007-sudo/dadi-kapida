import { Injectable } from "@nestjs/common";
import { CandidateStatus, FamilyRequestStatus, FamilyStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async metrics() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalApplications,
      todayApplications,
      totalCandidates,
      approvedCandidates,
      totalFamilies,
      activeFamilies,
      activeFamilyRequests,
      openTasks,
      pendingPayments
    ] = await Promise.all([
      this.prisma.candidateApplication.count(),
      this.prisma.candidateApplication.count({ where: { created_at: { gte: todayStart } } }),
      this.prisma.candidate.count({ where: { deleted_at: null } }),
      this.prisma.candidate.count({ where: { status: CandidateStatus.APPROVED, deleted_at: null } }),
      this.prisma.family.count({ where: { deleted_at: null } }),
      this.prisma.family.count({
        where: { status: { in: [FamilyStatus.QUALIFIED, FamilyStatus.ACTIVE] }, deleted_at: null }
      }),
      this.prisma.familyRequest.count({
        where: {
          status: {
            in: [
              FamilyRequestStatus.OPEN,
              FamilyRequestStatus.MATCHING,
              FamilyRequestStatus.SHORTLISTED,
              FamilyRequestStatus.INTERVIEWING,
              FamilyRequestStatus.OFFER
            ]
          }
        }
      }),
      this.prisma.task.count({ where: { status: { in: ["TODO", "IN_PROGRESS"] } } }),
      this.prisma.invoice.count({ where: { status: "PENDING" } })
    ]);

    return {
      totalApplications,
      todayApplications,
      totalCandidates,
      approvedCandidates,
      totalFamilies,
      activeFamilies,
      activeFamilyRequests,
      openTasks,
      pendingPayments
    };
  }

  async trend(days = 14) {
    const safeDays = Math.max(7, Math.min(days, 60));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - (safeDays - 1));

    const [applications, familyRequests, placements, completedTasks] = await Promise.all([
      this.prisma.candidateApplication.findMany({
        where: { created_at: { gte: start } },
        select: { created_at: true }
      }),
      this.prisma.familyRequest.findMany({
        where: { created_at: { gte: start } },
        select: { created_at: true }
      }),
      this.prisma.placement.findMany({
        where: { created_at: { gte: start } },
        select: { created_at: true }
      }),
      this.prisma.task.findMany({
        where: { status: "DONE", updated_at: { gte: start } },
        select: { updated_at: true }
      })
    ]);

    const buckets: Record<
      string,
      {
        date: string;
        label: string;
        applications: number;
        requests: number;
        placements: number;
        completedTasks: number;
      }
    > = {};

    for (let index = 0; index < safeDays; index += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      const key = this.toDayKey(d);
      buckets[key] = {
        date: key,
        label: d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
        applications: 0,
        requests: 0,
        placements: 0,
        completedTasks: 0
      };
    }

    for (const row of applications) {
      const key = this.toDayKey(row.created_at);
      if (buckets[key]) buckets[key].applications += 1;
    }
    for (const row of familyRequests) {
      const key = this.toDayKey(row.created_at);
      if (buckets[key]) buckets[key].requests += 1;
    }
    for (const row of placements) {
      const key = this.toDayKey(row.created_at);
      if (buckets[key]) buckets[key].placements += 1;
    }
    for (const row of completedTasks) {
      const key = this.toDayKey(row.updated_at);
      if (buckets[key]) buckets[key].completedTasks += 1;
    }

    return Object.values(buckets);
  }

  private toDayKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
