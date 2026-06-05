import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateContractTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  body?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
