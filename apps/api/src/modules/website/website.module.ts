import { Module } from "@nestjs/common";
import { ApplicationsModule } from "../applications/applications.module";
import { AdminWebsiteController, PublicWebsiteController } from "./website.controller";
import { WebsiteService } from "./website.service";

@Module({
  imports: [ApplicationsModule],
  controllers: [PublicWebsiteController, AdminWebsiteController],
  providers: [WebsiteService]
})
export class WebsiteModule {}
