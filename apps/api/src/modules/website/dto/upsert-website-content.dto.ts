import { WebsiteContentStatus, WebsiteContentType } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export class UpsertWebsiteContentDto {
  @IsEnum(WebsiteContentType)
  type!: WebsiteContentType;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsEnum(WebsiteContentStatus)
  status?: WebsiteContentStatus;

  @IsOptional()
  @IsString()
  hero_title?: string;

  @IsOptional()
  @IsString()
  hero_subtitle?: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  seo_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;

  @IsOptional()
  @IsString()
  canonical_url?: string;

  @IsOptional()
  @IsString()
  robots?: string;
}
