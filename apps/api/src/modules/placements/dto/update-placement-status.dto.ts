import { PlacementStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdatePlacementStatusDto {
  @IsEnum(PlacementStatus)
  status!: PlacementStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
