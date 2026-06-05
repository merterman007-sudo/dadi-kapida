import { PaymentStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateInvoiceDto {
  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  placement_id?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  due_date?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
