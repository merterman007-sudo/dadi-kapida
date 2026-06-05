import { IsObject, IsOptional, IsString } from "class-validator";

export class UpsertWebsiteSettingDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsObject()
  value!: Record<string, unknown>;
}
