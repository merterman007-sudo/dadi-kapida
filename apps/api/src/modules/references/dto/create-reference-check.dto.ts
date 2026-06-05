import { ReferenceStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateReferenceCheckDto {
  @IsEnum(ReferenceStatus)
  status!: ReferenceStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
