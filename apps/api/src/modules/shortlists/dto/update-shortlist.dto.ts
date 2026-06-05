import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateShortlistDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
