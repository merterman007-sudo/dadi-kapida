import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getStatus() {
    return { module: "settings", status: "ok" };
  }

  async listCategories() {
    const [serviceCategories, skills, certifications, languages] = await Promise.all([
      this.prisma.serviceCategory.findMany({ orderBy: { name: "asc" } }),
      this.prisma.skill.findMany({ orderBy: { name: "asc" } }),
      this.prisma.certification.findMany({ orderBy: { name: "asc" } }),
      this.prisma.language.findMany({ orderBy: { name: "asc" } })
    ]);

    return {
      serviceCategories,
      skills,
      certifications,
      languages
    };
  }

  getStatusGuide() {
    return {
      familyStatuses: [
        { key: "LEAD", label: "Lead", description: "Yeni gelen, henüz tam doğrulanmamış aile adayı." },
        { key: "QUALIFIED", label: "Qualified", description: "Temel ihtiyaçları doğrulandı, çalışmaya hazır." },
        { key: "ACTIVE", label: "Active", description: "Aktif olarak açık talebi veya devam eden süreci var." },
        { key: "PASSIVE", label: "Passive", description: "Şu an aktif talebi yok, bekleme durumunda." },
        { key: "BLACKLISTED", label: "Blacklisted", description: "Politika nedeniyle işlem kapalı." }
      ],
      familyRequestStatuses: [
        { key: "DRAFT", next: ["OPEN", "CANCELLED"] },
        { key: "OPEN", next: ["MATCHING", "CANCELLED", "LOST"] },
        { key: "MATCHING", next: ["SHORTLISTED", "CANCELLED", "LOST"] },
        { key: "SHORTLISTED", next: ["INTERVIEWING", "MATCHING", "CANCELLED", "LOST"] },
        { key: "INTERVIEWING", next: ["OFFER", "MATCHING", "CANCELLED", "LOST"] },
        { key: "OFFER", next: ["PLACED", "INTERVIEWING", "CANCELLED", "LOST"] },
        { key: "PLACED", next: [] },
        { key: "CANCELLED", next: [] },
        { key: "LOST", next: [] }
      ]
    };
  }

  async reseedDemoData() {
    const command =
      process.platform === "win32"
        ? "cmd /d /s /c pnpm --filter @dadi-kapida/database db:seed:demo"
        : "pnpm --filter @dadi-kapida/database db:seed:demo";

    const { stdout } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 120_000
    });

    return {
      success: true,
      output: stdout.trim()
    };
  }
}
