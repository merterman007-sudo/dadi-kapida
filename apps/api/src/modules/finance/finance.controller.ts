import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { FinanceService } from "./finance.service";

@Controller("finance")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Get("_status")
  @RequirePermissions("finance.read")
  getStatus() {
    return this.service.getStatus();
  }

  @Get("invoices")
  @RequirePermissions("finance.read")
  listInvoices(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.service.listInvoices(Number(page ?? 1), Number(limit ?? 20));
  }

  @Get("trend")
  @RequirePermissions("finance.read")
  getTrend(@Query("days") days?: string) {
    return this.service.trend(Number(days ?? 14));
  }

  @Post("invoices")
  @RequirePermissions("finance.update")
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.service.createInvoice(dto);
  }

  @Patch("invoices/:id")
  @RequirePermissions("finance.update")
  updateInvoice(@Param("id") id: string, @Body() dto: UpdateInvoiceDto) {
    return this.service.updateInvoice(id, dto);
  }

  @Post("invoices/:id/mark-paid")
  @RequirePermissions("finance.update")
  markInvoicePaid(@Param("id") id: string) {
    return this.service.markInvoicePaid(id);
  }

  @Post("invoices/:id/send-reminder")
  @RequirePermissions("finance.update")
  sendOverdueReminder(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.sendOverdueReminder(id, user.id);
  }

  @Get("payments")
  @RequirePermissions("finance.read")
  listPayments(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.service.listPayments(Number(page ?? 1), Number(limit ?? 20));
  }

  @Get("expenses")
  @RequirePermissions("finance.read")
  listExpenses(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.service.listExpenses(Number(page ?? 1), Number(limit ?? 20));
  }

  @Post("payments")
  @RequirePermissions("finance.update")
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.service.createPayment(dto);
  }

  @Post("expenses")
  @RequirePermissions("finance.update")
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.service.createExpense(dto);
  }

  @Patch("payments/:id")
  @RequirePermissions("finance.update")
  updatePayment(@Param("id") id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.updatePayment(id, dto);
  }

  @Patch("expenses/:id")
  @RequirePermissions("finance.update")
  updateExpense(@Param("id") id: string, @Body() dto: UpdateExpenseDto) {
    return this.service.updateExpense(id, dto);
  }

  @Post("payments/:id/refund")
  @RequirePermissions("finance.update")
  refundPayment(@Param("id") id: string) {
    return this.service.refundPayment(id);
  }

  @Post("expenses/:id/mark-paid")
  @RequirePermissions("finance.update")
  markExpensePaid(@Param("id") id: string) {
    return this.service.markExpensePaid(id);
  }
}
