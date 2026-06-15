/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streakDays` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xpCurrent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xpRequired` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "level",
DROP COLUMN "streakDays",
DROP COLUMN "xpCurrent",
DROP COLUMN "xpRequired";

-- CreateTable
CREATE TABLE "public"."UserStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "xpCurrent" INTEGER NOT NULL DEFAULT 0,
    "xpRequired" INTEGER NOT NULL DEFAULT 500,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "public"."UserStats"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
