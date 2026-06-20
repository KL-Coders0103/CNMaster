-- CreateIndex
CREATE INDEX "Chapter_subjectId_idx" ON "public"."Chapter"("subjectId");

-- CreateIndex
CREATE INDEX "Note_chapterId_idx" ON "public"."Note"("chapterId");

-- CreateIndex
CREATE INDEX "UserBookmark_userId_idx" ON "public"."UserBookmark"("userId");
