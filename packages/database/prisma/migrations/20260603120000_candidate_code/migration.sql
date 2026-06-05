-- Add immutable public candidate code
ALTER TABLE "Candidate" ADD COLUMN "candidate_code" TEXT;

UPDATE "Candidate"
SET "candidate_code" = 'ADY-' || upper(substring(replace("id"::text, '-', '') from 1 for 12))
WHERE "candidate_code" IS NULL;

ALTER TABLE "Candidate" ALTER COLUMN "candidate_code" SET NOT NULL;
CREATE UNIQUE INDEX "Candidate_candidate_code_key" ON "Candidate"("candidate_code");
