import { IsEnum, IsOptional, IsString } from "class-validator";
import { CandidateApplicationStatus } from "@prisma/client";

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(CandidateApplicationStatus)
  status?: CandidateApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
