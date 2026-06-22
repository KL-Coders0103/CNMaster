/*
  Warnings:

  - You are about to drop the `QuestionBookmark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."QuestionBookmark" DROP CONSTRAINT "QuestionBookmark_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuestionBookmark" DROP CONSTRAINT "QuestionBookmark_userId_fkey";

-- DropTable
DROP TABLE "public"."QuestionBookmark";

-- CreateTable
CREATE TABLE "public"."BookmarkedQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkedQuestion_userId_questionId_key" ON "public"."BookmarkedQuestion"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
