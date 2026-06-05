import { PaymentStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInvoiceDto {
  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  placement_id?: string;

  @IsNumber()
  amount!: number;

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
