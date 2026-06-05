import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCandidateDocumentDto {
  @IsString()
  @MaxLength(120)
  document_type!: string;

  @IsString()
  @MaxLength(500)
  file_path!: string;

  @IsString()
  @MaxLength(255)
  file_name!: string;

  @IsOptional()
  @IsString()
  expires_at?: string;
}
