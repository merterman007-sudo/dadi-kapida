import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCandidateLanguageDto {
  @IsUUID()
  language_id!: string;

  @IsOptional()
  @IsString()
  level?: string;
}
