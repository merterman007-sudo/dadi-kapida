import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { AuditLogsModule } from "./modules/audit-logs/audit-logs.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CandidatesModule } from "./modules/candidates/candidates.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { FamiliesModule } from "./modules/families/families.module";
import { FamilyRequestsModule } from "./modules/family-requests/family-requests.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { HealthModule } from "./modules/health/health.module";
import { MatchingModule } from "./modules/matching/matching.module";
import { MeetingsModule } from "./modules/meetings/meetings.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { NotesModule } from "./modules/notes/notes.module";
import { PlacementsModule } from "./modules/placements/placements.module";
import { ReferencesModule } from "./modules/references/references.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { RolesModule } from "./modules/roles/roles.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { ShortlistsModule } from "./modules/shortlists/shortlists.module";
import { WebsiteModule } from "./modules/website/website.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ["../../.env", ".env"], isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60
      }
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    DashboardModule,
    ApplicationsModule,
    CandidatesModule,
    FamiliesModule,
    FamilyRequestsModule,
    MatchingModule,
    ShortlistsModule,
    MeetingsModule,
    TasksModule,
    NotesModule,
    DocumentsModule,
    ReferencesModule,
    PlacementsModule,
    ContractsModule,
    FinanceModule,
    MessagesModule,
    ReportsModule,
    SettingsModule,
    AuditLogsModule,
    WebsiteModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
