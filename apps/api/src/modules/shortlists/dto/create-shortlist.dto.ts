import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateShortlistDto {
  @IsUUID()
  family_request_id!: string;

  @IsString()
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
