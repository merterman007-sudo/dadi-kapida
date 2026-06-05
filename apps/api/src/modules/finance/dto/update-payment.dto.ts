import { PaymentStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdatePaymentDto {
  @IsOptional()
  @IsUUID()
  invoice_id?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  paid_at?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  transaction_ref?: string;
}
