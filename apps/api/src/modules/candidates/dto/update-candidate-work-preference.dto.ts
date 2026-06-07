import { IsBoolean, IsEnum, IsInt, IsOptional } from "class-validator";
import { WorkType } from "@prisma/client";

export class UpdateCandidateWorkPreferenceDto {
  @IsOptional()
  @IsEnum(WorkType)
  work_type?: WorkType;

  @IsOptional()
  @IsBoolean()
  can_live_in?: boolean;

  @IsOptional()
  @IsBoolean()
  night_shift_ok?: boolean;

  @IsOptional()
  @IsBoolean()
  weekend_ok?: boolean;

  @IsOptional()
  @IsInt()
  min_salary?: number;

  @IsOptional()
  @IsInt()
  max_salary?: number;
}
