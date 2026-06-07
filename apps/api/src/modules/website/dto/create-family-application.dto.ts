import { IsBoolean, IsDateString, IsInt, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFamilyApplicationDto {
  @IsString()
  full_name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  service_type?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsString()
  preferred_contact_channel?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  working_hours?: string;

  @IsOptional()
  @IsInt()
  budget_min?: number;

  @IsOptional()
  @IsInt()
  budget_max?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  idempotency_key?: string;

  @IsOptional()
  @IsString()
  honeypot?: string;

  @IsOptional()
  @IsString()
  submitted_at?: string;

  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  @IsOptional()
  @IsBoolean()
  marketing_consent?: boolean;

  @IsOptional()
  @IsUUID()
  created_by_user_id?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
