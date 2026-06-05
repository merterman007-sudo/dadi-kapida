import { IsOptional, IsString, IsUUID } from "class-validator";

export class AddShortlistItemDto {
  @IsUUID()
  candidate_id!: string;

  @IsOptional()
  @IsString()
  consultant_note?: string;
}
