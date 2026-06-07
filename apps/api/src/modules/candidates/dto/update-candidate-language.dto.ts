import { IsOptional, IsString } from "class-validator";

export class UpdateCandidateLanguageDto {
  @IsOptional()
  @IsString()
  level?: string;
}
