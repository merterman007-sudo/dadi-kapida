import { Module } from "@nestjs/common";
import { ShortlistsController } from "./shortlists.controller";
import { ShortlistsService } from "./shortlists.service";

@Module({
  controllers: [ShortlistsController],
  providers: [ShortlistsService],
  exports: [ShortlistsService]
})
export class ShortlistsModule {}
