/*
  Warnings:

  - A unique constraint covering the columns `[userId,moduleName]` on the table `LearningProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "LearningProgress_userId_idx" ON "public"."LearningProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_userId_moduleName_key" ON "public"."LearningProgress"("userId", "moduleName");

-- CreateIndex
CREATE INDEX "PlannerTask_userId_idx" ON "public"."PlannerTask"("userId");

-- CreateIndex
CREATE INDEX "PlannerTask_dueDate_idx" ON "public"."PlannerTask"("dueDate");
