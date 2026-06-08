import { CandidateStatus } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class CreateCandidateDto {
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
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsDateString()
  available_from?: string;

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
  @IsString()
  preferred_cities?: string;

  @IsOptional()
  @IsString()
  applied_position?: string;

  @IsOptional()
  @IsString()
  education_level?: string;

  @IsOptional()
  @IsInt()
  years_of_experience?: number;

  @IsOptional()
  @IsNumber()
  expected_salary_min?: number;

  @IsOptional()
  @IsNumber()
  expected_salary_max?: number;

  @IsOptional()
  @IsEnum(CandidateStatus)
  status?: CandidateStatus;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsBoolean()
  has_first_aid_certificate?: boolean;

  @IsOptional()
  @IsString()
  availability_status?: string;

  @IsOptional()
  @IsString()
  smoking_status?: string;
}
