import { FamilyRequestStatus, WorkType } from "@prisma/client";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";

export class CreateFamilyRequestDto {
  @IsUUID()
  family_id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsEnum(FamilyRequestStatus)
  status?: FamilyRequestStatus;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsEnum(WorkType)
  work_type?: WorkType;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  salary_min?: number;

  @IsOptional()
  @IsNumber()
  salary_max?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsInt()
  children_count?: number;

  @IsOptional()
  @IsString()
  child_age_groups?: string;

  @IsOptional()
  @IsBoolean()
  requires_first_aid?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_non_smoker?: boolean;

  @IsOptional()
  @IsInt()
  min_experience_years?: number;

  @IsOptional()
  @IsString()
  preferred_education_level?: string;

  @IsOptional()
  @IsString()
  required_language?: string;

  @IsOptional()
  @IsString()
  required_language_level?: string;

  @IsOptional()
  @IsBoolean()
  has_pets?: boolean;

  @IsOptional()
  @IsBoolean()
  live_in_room_available?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
