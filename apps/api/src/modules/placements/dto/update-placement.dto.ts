import { PlacementStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdatePlacementDto {
  @IsOptional()
  @IsUUID()
  family_request_id?: string;

  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsNumber()
  agreed_salary?: number;

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
