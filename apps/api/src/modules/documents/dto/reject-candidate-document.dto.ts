import { IsString, MaxLength } from "class-validator";

export class RejectCandidateDocumentDto {
  @IsString()
  @MaxLength(500)
  reason!: string;
}
