import { IsString, MaxLength } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @MaxLength(60)
  entity_type!: string;

  @IsString()
  @MaxLength(120)
  entity_id!: string;

  @IsString()
  @MaxLength(5000)
  content!: string;
}
