-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteContent" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteFormSubmission" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteMediaAsset" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteRedirect" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteSetting" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WebsiteWhatsAppSetting" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "WebsiteSetting_group_idx" ON "WebsiteSetting"("group");
