import { Module } from "@nestjs/common";
import { FamilyRequestsController } from "./family-requests.controller";
import { FamilyRequestsService } from "./family-requests.service";

@Module({
  controllers: [FamilyRequestsController],
  providers: [FamilyRequestsService],
  exports: [FamilyRequestsService]
})
export class FamilyRequestsModule {}
