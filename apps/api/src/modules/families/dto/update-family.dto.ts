import { FamilyStatus } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class UpdateFamilyDto {
  @IsOptional()
  @IsString()
  family_name?: string;

  @IsOptional()
  @IsString()
  primary_contact_name?: string;

  @IsOptional()
  @IsString()
  primary_contact_phone?: string;

  @IsOptional()
  @IsEmail()
  primary_contact_email?: string;

  @IsOptional()
  @IsString()
  secondary_contact_name?: string;

  @IsOptional()
  @IsString()
  secondary_contact_phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(FamilyStatus)
  status?: FamilyStatus;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsNumber()
  budget_min?: number;

  @IsOptional()
  @IsNumber()
  budget_max?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
