-- CreateEnum
CREATE TYPE "public"."AssessmentType" AS ENUM ('Quiz', 'Assignment');

-- CreateTable
CREATE TABLE "public"."Assessment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."AssessmentType" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "targetYear" TEXT,
    "targetBranch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_dueDate_idx" ON "public"."Assessment"("dueDate");
