import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateShortlistItemDto {
  @IsOptional()
  @IsString()
  consultant_note?: string;

  @IsOptional()
  @IsString()
  family_feedback?: string;

  @IsOptional()
  @IsBoolean()
  sent_to_family?: boolean;
}
