-- CreateEnum
CREATE TYPE "WebsiteContentType" AS ENUM ('PAGE', 'HOME', 'SERVICE', 'LOCATION', 'BLOG_POST', 'BLOG_CATEGORY', 'FAQ', 'TESTIMONIAL', 'CASE_STUDY', 'LEGAL_PAGE', 'NAVIGATION', 'FOOTER');

-- CreateEnum
CREATE TYPE "WebsiteContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebsiteSubmissionStatus" AS ENUM ('NEW', 'REVIEWING', 'SYNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebsiteMediaVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "WebsiteSetting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "group" TEXT,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContent" (
    "id" UUID NOT NULL,
    "type" "WebsiteContentType" NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "status" "WebsiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "payload" JSONB NOT NULL,
    "seo_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT,
    "published_at" TIMESTAMP(3),
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContentRevision" (
    "id" UUID NOT NULL,
    "website_content_id" UUID NOT NULL,
    "snapshot" JSONB NOT NULL,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteContentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteMediaAsset" (
    "id" UUID NOT NULL,
    "bucket" TEXT NOT NULL,
    "object_key" TEXT NOT NULL,
    "public_url" TEXT,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "alt_text" TEXT,
    "caption" TEXT,
    "visibility" "WebsiteMediaVisibility" NOT NULL DEFAULT 'PRIVATE',
    "status" TEXT NOT NULL DEFAULT 'pending_scan',
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteMediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteFormSubmission" (
    "id" UUID NOT NULL,
    "form_type" TEXT NOT NULL,
    "status" "WebsiteSubmissionStatus" NOT NULL DEFAULT 'NEW',
    "idempotency_key" TEXT,
    "payload" JSONB NOT NULL,
    "crm_entity_type" TEXT,
    "crm_entity_id" TEXT,
    "source" TEXT,
    "utm" JSONB,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteConsentLog" (
    "id" UUID NOT NULL,
    "form_type" TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "subject_id" TEXT,
    "consent_type" TEXT NOT NULL,
    "text_version" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteRedirect" (
    "id" UUID NOT NULL,
    "source_path" TEXT NOT NULL,
    "target_path" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteIntegrationLog" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteIntegrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteWhatsAppSetting" (
    "id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "default_phone" TEXT,
    "family_phone" TEXT,
    "candidate_phone" TEXT,
    "support_phone" TEXT,
    "default_message" TEXT,
    "family_message" TEXT,
    "candidate_message" TEXT,
    "out_of_hours_message" TEXT,
    "position" TEXT,
    "show_on_mobile" BOOLEAN NOT NULL DEFAULT true,
    "show_on_desktop" BOOLEAN NOT NULL DEFAULT true,
    "active_hours" JSONB,
    "page_rules" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteWhatsAppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSetting_key_key" ON "WebsiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContent_slug_key" ON "WebsiteContent"("slug");

-- CreateIndex
CREATE INDEX "WebsiteContent_type_status_idx" ON "WebsiteContent"("type", "status");

-- CreateIndex
CREATE INDEX "WebsiteContentRevision_website_content_id_created_at_idx" ON "WebsiteContentRevision"("website_content_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteMediaAsset_object_key_key" ON "WebsiteMediaAsset"("object_key");

-- CreateIndex
CREATE INDEX "WebsiteFormSubmission_form_type_status_created_at_idx" ON "WebsiteFormSubmission"("form_type", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteFormSubmission_idempotency_key_key" ON "WebsiteFormSubmission"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteRedirect_source_path_key" ON "WebsiteRedirect"("source_path");
