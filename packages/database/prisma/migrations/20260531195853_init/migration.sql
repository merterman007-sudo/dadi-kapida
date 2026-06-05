-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'DISABLED');

-- CreateEnum
CREATE TYPE "CandidateApplicationStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED_TO_CANDIDATE', 'REJECTED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('NEW', 'PRE_SCREEN', 'INTERVIEW', 'REFERENCE_CHECK', 'DOCUMENT_PENDING', 'APPROVED', 'PASSIVE', 'REJECTED', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "FamilyStatus" AS ENUM ('LEAD', 'QUALIFIED', 'ACTIVE', 'PASSIVE', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "FamilyRequestStatus" AS ENUM ('DRAFT', 'OPEN', 'MATCHING', 'SHORTLISTED', 'INTERVIEWING', 'OFFER', 'PLACED', 'CANCELLED', 'LOST');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('LIVE_IN', 'DAYTIME', 'NIGHT', 'PART_TIME', 'FULL_TIME');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('FAMILY_INTAKE', 'CANDIDATE_INTERVIEW', 'FAMILY_CANDIDATE_MEETING', 'FOLLOW_UP', 'REFERENCE_CALL');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReferenceStatus" AS ENUM ('NEW', 'CONTACTED', 'VERIFIED', 'NEGATIVE', 'UNREACHABLE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SUGGESTED', 'SHORTLISTED', 'REJECTED', 'SENT_TO_FAMILY', 'INTERVIEW_REQUESTED', 'PLACED');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('OFFERED', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'TERMINATED', 'REPLACEMENT');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateApplication" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "district" TEXT,
    "birth_date" TIMESTAMP(3),
    "experience_years" INTEGER,
    "expected_salary_min" DECIMAL(12,2),
    "expected_salary_max" DECIMAL(12,2),
    "work_type_preference" "WorkType",
    "can_live_in" BOOLEAN,
    "has_first_aid_certificate" BOOLEAN,
    "smoking_status" TEXT,
    "notes" TEXT,
    "source" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "raw_payload" JSONB,
    "status" "CandidateApplicationStatus" NOT NULL DEFAULT 'NEW',
    "candidate_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "birth_date" TIMESTAMP(3),
    "gender" TEXT,
    "city" TEXT,
    "district" TEXT,
    "address" TEXT,
    "education_level" TEXT,
    "years_of_experience" INTEGER,
    "expected_salary_min" DECIMAL(12,2),
    "expected_salary_max" DECIMAL(12,2),
    "smoking_status" TEXT,
    "has_first_aid_certificate" BOOLEAN NOT NULL DEFAULT false,
    "availability_status" TEXT,
    "available_from" TIMESTAMP(3),
    "status" "CandidateStatus" NOT NULL DEFAULT 'NEW',
    "is_placeable" BOOLEAN NOT NULL DEFAULT true,
    "reference_score" INTEGER DEFAULT 0,
    "interview_score" INTEGER DEFAULT 0,
    "document_score" INTEGER DEFAULT 0,
    "quality_score" INTEGER DEFAULT 0,
    "source" TEXT,
    "owner_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAddress" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "title" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address_line" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateWorkPreference" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "work_type" "WorkType" NOT NULL,
    "can_live_in" BOOLEAN NOT NULL DEFAULT false,
    "night_shift_ok" BOOLEAN NOT NULL DEFAULT false,
    "weekend_ok" BOOLEAN NOT NULL DEFAULT false,
    "min_salary" DECIMAL(12,2),
    "max_salary" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateWorkPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateExperience" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "age_group_experience" TEXT,
    "years" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSkill" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateCertification" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "certification_id" UUID NOT NULL,
    "certificate_no" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateLanguage" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "language_id" UUID NOT NULL,
    "level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateDocument" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "reject_reason" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateReference" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "relation" TEXT,
    "notes" TEXT,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceCheck" (
    "id" UUID NOT NULL,
    "candidate_reference_id" UUID NOT NULL,
    "checked_by_user_id" UUID,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferenceCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateInterview" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "interviewer_id" UUID,
    "scheduled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "score" INTEGER,
    "outcome" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateStatusHistory" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "old_status" "CandidateStatus",
    "new_status" "CandidateStatus" NOT NULL,
    "reason" TEXT,
    "changed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateBlacklistRecord" (
    "id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "blocked_by" UUID,
    "blocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateBlacklistRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" UUID NOT NULL,
    "family_name" TEXT NOT NULL,
    "primary_contact_name" TEXT NOT NULL,
    "primary_contact_phone" TEXT NOT NULL,
    "primary_contact_email" TEXT,
    "secondary_contact_name" TEXT,
    "secondary_contact_phone" TEXT,
    "city" TEXT,
    "district" TEXT,
    "address" TEXT,
    "status" "FamilyStatus" NOT NULL DEFAULT 'LEAD',
    "source" TEXT,
    "budget_min" DECIMAL(12,2),
    "budget_max" DECIMAL(12,2),
    "notes" TEXT,
    "owner_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "relation" TEXT,
    "birth_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyAddress" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "title" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address_line" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyRequest" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "FamilyRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" INTEGER DEFAULT 0,
    "service_category_id" UUID,
    "work_type" "WorkType",
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "salary_min" DECIMAL(12,2),
    "salary_max" DECIMAL(12,2),
    "city" TEXT,
    "district" TEXT,
    "children_count" INTEGER,
    "child_age_groups" TEXT,
    "requires_first_aid" BOOLEAN NOT NULL DEFAULT false,
    "requires_non_smoker" BOOLEAN NOT NULL DEFAULT false,
    "min_experience_years" INTEGER,
    "preferred_education_level" TEXT,
    "required_language" TEXT,
    "required_language_level" TEXT,
    "has_pets" BOOLEAN,
    "live_in_room_available" BOOLEAN,
    "description" TEXT,
    "requirements_json" JSONB,
    "match_weights_json" JSONB,
    "owner_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestScheduleRule" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestScheduleRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestRequiredSkill" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "level" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestRequiredSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestRequiredCertification" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "certification_id" UUID NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestRequiredCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchRun" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "run_by_user_id" UUID,
    "weights_json" JSONB,
    "filters_json" JSONB,
    "result_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateMatch" (
    "id" UUID NOT NULL,
    "match_run_id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SUGGESTED',
    "total_score" DECIMAL(5,2) NOT NULL,
    "location_score" INTEGER,
    "salary_score" INTEGER,
    "experience_score" INTEGER,
    "child_age_experience_score" INTEGER,
    "work_type_score" INTEGER,
    "availability_score" INTEGER,
    "reference_score" INTEGER,
    "interview_score" INTEGER,
    "document_score" INTEGER,
    "certification_score" INTEGER,
    "smoking_score" INTEGER,
    "language_score" INTEGER,
    "explanation_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortlistItem" (
    "id" UUID NOT NULL,
    "shortlist_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "consultant_note" TEXT,
    "sent_to_family_at" TIMESTAMP(3),
    "family_feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" UUID NOT NULL,
    "type" "MeetingType" NOT NULL,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "title" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "family_id" UUID,
    "candidate_id" UUID,
    "family_request_id" UUID,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "location" TEXT,
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "due_at" TIMESTAMP(3),
    "assignee_user_id" UUID,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "type" TEXT,
    "read_at" TIMESTAMP(3),
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" UUID NOT NULL,
    "family_request_id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "agreed_salary" DECIMAL(12,2) NOT NULL,
    "service_fee" DECIMAL(12,2),
    "status" "PlacementStatus" NOT NULL DEFAULT 'OFFERED',
    "guarantee_until" TIMESTAMP(3),
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementStatusHistory" (
    "id" UUID NOT NULL,
    "placement_id" UUID NOT NULL,
    "old_status" "PlacementStatus",
    "new_status" "PlacementStatus" NOT NULL,
    "reason" TEXT,
    "changed_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" UUID NOT NULL,
    "contract_template_id" UUID,
    "placement_id" UUID,
    "family_id" UUID,
    "candidate_id" UUID,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "file_path" TEXT,
    "sent_at" TIMESTAMP(3),
    "signed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "family_id" UUID,
    "placement_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "invoice_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paid_at" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "to_value" TEXT,
    "from_value" TEXT,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "language_code" TEXT NOT NULL DEFAULT 'tr',
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "config_json" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "consent_type" TEXT NOT NULL,
    "policy_version" TEXT,
    "granted" BOOLEAN NOT NULL,
    "granted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataErasureRequest" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "requested_by_user_id" UUID,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataErasureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_id_key" ON "UserRole"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_key" ON "RolePermission"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "AuditLog_entity_type_entity_id_idx" ON "AuditLog"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "CandidateApplication_phone_created_at_idx" ON "CandidateApplication"("phone", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_phone_key" ON "Candidate"("phone");

-- CreateIndex
CREATE INDEX "Candidate_status_city_district_idx" ON "Candidate"("status", "city", "district");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkill_candidate_id_skill_id_key" ON "CandidateSkill"("candidate_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateCertification_candidate_id_certification_id_key" ON "CandidateCertification"("candidate_id", "certification_id");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateLanguage_candidate_id_language_id_key" ON "CandidateLanguage"("candidate_id", "language_id");

-- CreateIndex
CREATE INDEX "Family_status_city_district_idx" ON "Family"("status", "city", "district");

-- CreateIndex
CREATE INDEX "FamilyRequest_status_city_district_work_type_idx" ON "FamilyRequest"("status", "city", "district", "work_type");

-- CreateIndex
CREATE UNIQUE INDEX "RequestRequiredSkill_family_request_id_skill_id_key" ON "RequestRequiredSkill"("family_request_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestRequiredCertification_family_request_id_certificatio_key" ON "RequestRequiredCertification"("family_request_id", "certification_id");

-- CreateIndex
CREATE INDEX "CandidateMatch_family_request_id_total_score_idx" ON "CandidateMatch"("family_request_id", "total_score");

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistItem_shortlist_id_candidate_id_key" ON "ShortlistItem"("shortlist_id", "candidate_id");

-- CreateIndex
CREATE INDEX "Task_assignee_user_id_status_due_at_idx" ON "Task"("assignee_user_id", "status", "due_at");

-- CreateIndex
CREATE INDEX "Note_entity_type_entity_id_idx" ON "Note"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "Placement_status_start_date_idx" ON "Placement"("status", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_name_key" ON "Certification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "ConsentRecord_entity_type_entity_id_idx" ON "ConsentRecord"("entity_type", "entity_id");
