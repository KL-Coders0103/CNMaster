/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BookmarkedQuestion" DROP CONSTRAINT "BookmarkedQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookmarkedQuestion" DROP CONSTRAINT "BookmarkedQuestion_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chapter" DROP CONSTRAINT "Chapter_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizAnswer" DROP CONSTRAINT "QuizAnswer_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizAnswer" DROP CONSTRAINT "QuizAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WeakArea" DROP CONSTRAINT "WeakArea_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WeakArea" DROP CONSTRAINT "WeakArea_userId_fkey";

-- DropIndex
DROP INDEX "public"."AssignmentSubmission_assignmentId_idx";

-- DropIndex
DROP INDEX "public"."AssignmentSubmission_status_idx";

-- DropIndex
DROP INDEX "public"."Chapter_subjectId_idx";

-- DropIndex
DROP INDEX "public"."Notification_userId_idx";

-- DropIndex
DROP INDEX "public"."PlannerTask_dueDate_idx";

-- DropIndex
DROP INDEX "public"."PlannerTask_userId_idx";

-- DropIndex
DROP INDEX "public"."QuizAttempt_status_idx";

-- DropIndex
DROP INDEX "public"."QuizAttempt_userId_idx";

-- AlterTable
ALTER TABLE "public"."Chapter" DROP COLUMN "subjectId";

-- DropTable
DROP TABLE "public"."Subject";

-- CreateIndex
CREATE INDEX "Assessment_type_idx" ON "public"."Assessment"("type");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_assignmentId_status_idx" ON "public"."AssignmentSubmission"("assignmentId", "status");

-- CreateIndex
CREATE INDEX "BookmarkedQuestion_userId_idx" ON "public"."BookmarkedQuestion"("userId");

-- CreateIndex
CREATE INDEX "DailyChallenge_date_idx" ON "public"."DailyChallenge"("date");

-- CreateIndex
CREATE INDEX "EmailOtp_email_expiresAt_idx" ON "public"."EmailOtp"("email", "expiresAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "PlannerTask_userId_dueDate_idx" ON "public"."PlannerTask"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "QuizAnswer_attemptId_idx" ON "public"."QuizAnswer"("attemptId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_status_idx" ON "public"."QuizAttempt"("userId", "status");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "public"."User"("googleId");

-- CreateIndex
CREATE INDEX "UserStats_userId_idx" ON "public"."UserStats"("userId");

-- CreateIndex
CREATE INDEX "WeakArea_userId_idx" ON "public"."WeakArea"("userId");

-- CreateIndex
CREATE INDEX "WeakArea_chapterId_idx" ON "public"."WeakArea"("chapterId");

-- AddForeignKey
ALTER TABLE "public"."WeakArea" ADD CONSTRAINT "WeakArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeakArea" ADD CONSTRAINT "WeakArea_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "public"."QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
