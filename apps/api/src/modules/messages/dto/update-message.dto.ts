import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  channel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  direction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  entity_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  entity_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  to_value?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  from_value?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsOptional()
  @IsString()
  sent_at?: string;
}
