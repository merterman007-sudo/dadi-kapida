import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCandidateExperienceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  age_group_experience?: string;

  @IsOptional()
  @IsInt()
  years?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
