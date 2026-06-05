import { IsBoolean, IsEmail, IsObject, IsOptional, IsString } from "class-validator";

export class CreateWebsiteRequestDto {
  @IsString()
  full_name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  preferred_time?: string;

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
