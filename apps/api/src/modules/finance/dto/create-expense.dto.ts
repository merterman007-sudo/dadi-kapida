import { ExpenseStatus, ExpenseType } from "@prisma/client";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";

export class CreateExpenseDto {
  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsUUID()
  family_id?: string;

  @IsOptional()
  @IsUUID()
  placement_id?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  paid_at?: string;

  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  transaction_ref?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
