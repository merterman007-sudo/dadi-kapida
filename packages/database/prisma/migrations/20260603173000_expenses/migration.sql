-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('CANDIDATE_PAYMENT', 'OPERATING_EXPENSE');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "Expense" (
    "id" UUID NOT NULL,
    "type" "ExpenseType" NOT NULL DEFAULT 'OPERATING_EXPENSE',
    "candidate_id" UUID,
    "family_id" UUID,
    "placement_id" UUID,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paid_at" TIMESTAMP(3),
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "transaction_ref" TEXT,
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_type_status_created_at_idx" ON "Expense"("type", "status", "created_at");
