import { MeetingStatus, MeetingType } from "@prisma/client";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength
} from "class-validator";

export class UpdateMeetingDto {
  @IsOptional()
  @IsEnum(MeetingType)
  type?: MeetingType;

  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contact_phone?: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsString()
  entity_id?: string;

  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsUUID()
  family_request_id?: string;

  @IsOptional()
  @IsString()
  starts_at?: string;

  @IsOptional()
  @IsString()
  ends_at?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
