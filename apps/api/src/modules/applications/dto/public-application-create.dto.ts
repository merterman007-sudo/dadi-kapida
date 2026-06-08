import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { WorkType } from "@prisma/client";

export class PublicApplicationCreateDto {
  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  applied_position?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  experience_years?: number;

  @IsOptional()
  @IsInt()
  expected_salary_min?: number;

  @IsOptional()
  @IsInt()
  expected_salary_max?: number;

  @IsOptional()
  @IsEnum(WorkType)
  work_type_preference?: WorkType;

  @IsOptional()
  @IsBoolean()
  can_live_in?: boolean;

  @IsOptional()
  @IsBoolean()
  has_first_aid_certificate?: boolean;

  @IsOptional()
  @IsString()
  smoking_status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  utm_source?: string;

  @IsOptional()
  @IsString()
  utm_medium?: string;

  @IsOptional()
  @IsString()
  utm_campaign?: string;
}
