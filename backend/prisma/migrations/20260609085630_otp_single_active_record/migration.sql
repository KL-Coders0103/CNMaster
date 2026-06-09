/*
  Warnings:

  - A unique constraint covering the columns `[email,purpose]` on the table `EmailOtp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailOtp_email_purpose_key" ON "public"."EmailOtp"("email", "purpose");
