import { ContractStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateContractDto {
  @IsOptional()
  @IsUUID()
  contract_template_id?: string;

  @IsOptional()
  @IsUUID()
  placement_id?: string;

  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  file_path?: string;

  @IsOptional()
  @IsString()
  sent_at?: string;

  @IsOptional()
  @IsString()
  signed_at?: string;

  @IsOptional()
  @IsString()
  expires_at?: string;
}
