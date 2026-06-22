/*
  Warnings:

  - You are about to drop the column `topic` on the `WeakArea` table. All the data in the column will be lost.
  - Added the required column `chapterId` to the `WeakArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WeakArea` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."WeakArea" DROP CONSTRAINT "WeakArea_userId_fkey";

-- DropIndex
DROP INDEX "public"."WeakArea_userId_idx";

-- AlterTable
ALTER TABLE "public"."WeakArea" DROP COLUMN "topic",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "mistakeCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."WeakArea" ADD CONSTRAINT "WeakArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeakArea" ADD CONSTRAINT "WeakArea_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
