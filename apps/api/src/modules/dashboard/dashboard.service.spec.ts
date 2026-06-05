import { CandidateStatus, FamilyRequestStatus, FamilyStatus } from "@prisma/client";
import { DashboardService } from "./dashboard.service";

describe("DashboardService", () => {
  it("returns aggregated KPI metrics with expected filters", async () => {
    const prisma = {
      candidateApplication: {
        count: jest
          .fn()
          .mockResolvedValueOnce(52)
          .mockResolvedValueOnce(4)
      },
      candidate: {
        count: jest
          .fn()
          .mockResolvedValueOnce(24)
          .mockResolvedValueOnce(18)
      },
      family: {
        count: jest
          .fn()
          .mockResolvedValueOnce(11)
          .mockResolvedValueOnce(7)
      },
      familyRequest: {
        count: jest.fn().mockResolvedValue(9)
      },
      task: {
        count: jest.fn().mockResolvedValue(6)
      },
      invoice: {
        count: jest.fn().mockResolvedValue(3)
      }
    };

    const service = new DashboardService(prisma as never);
    const result = await service.metrics();

    expect(result).toEqual({
      totalApplications: 52,
      todayApplications: 4,
      totalCandidates: 24,
      approvedCandidates: 18,
      totalFamilies: 11,
      activeFamilies: 7,
      activeFamilyRequests: 9,
      openTasks: 6,
      pendingPayments: 3
    });

    expect(prisma.candidate.count).toHaveBeenCalledWith({
      where: { deleted_at: null }
    });
    expect(prisma.candidate.count).toHaveBeenCalledWith({
      where: { status: CandidateStatus.APPROVED, deleted_at: null }
    });
    expect(prisma.family.count).toHaveBeenCalledWith({
      where: { deleted_at: null }
    });
    expect(prisma.family.count).toHaveBeenCalledWith({
      where: { status: { in: [FamilyStatus.QUALIFIED, FamilyStatus.ACTIVE] }, deleted_at: null }
    });
    expect(prisma.familyRequest.count).toHaveBeenCalledWith({
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
    });
    expect(prisma.task.count).toHaveBeenCalledWith({
      where: { status: { in: ["TODO", "IN_PROGRESS"] } }
    });
    expect(prisma.invoice.count).toHaveBeenCalledWith({
      where: { status: "PENDING" }
    });

    const todayFilterCall = prisma.candidateApplication.count.mock.calls[1][0] as {
      where: { created_at: { gte: Date } };
    };
    expect(todayFilterCall.where.created_at.gte).toBeInstanceOf(Date);
  });
});
