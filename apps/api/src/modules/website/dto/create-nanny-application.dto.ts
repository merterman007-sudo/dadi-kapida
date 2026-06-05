import { IsBoolean, IsDateString, IsObject, IsOptional, IsString } from "class-validator";

export class CreateNannyApplicationDto {
  @IsString()
  full_name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

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
  @IsObject()
  payload?: Record<string, unknown>;
}
