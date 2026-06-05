import { PlacementStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePlacementDto {
  @IsUUID()
  family_request_id!: string;

  @IsUUID()
  family_id!: string;

  @IsUUID()
  candidate_id!: string;

  @IsString()
  start_date!: string;

  @IsNumber()
  agreed_salary!: number;

  @IsOptional()
  @IsNumber()
  service_fee?: number;

  @IsOptional()
  @IsEnum(PlacementStatus)
  status?: PlacementStatus;

  @IsOptional()
  @IsString()
  guarantee_until?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
