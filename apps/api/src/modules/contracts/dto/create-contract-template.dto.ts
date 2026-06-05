import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateContractTemplateDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsString()
  @MaxLength(20000)
  body!: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
