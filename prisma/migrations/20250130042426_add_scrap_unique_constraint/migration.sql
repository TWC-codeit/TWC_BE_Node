/*
  Warnings:

  - A unique constraint covering the columns `[userId,articleId]` on the table `scraps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "scraps_userId_articleId_key" ON "scraps"("userId", "articleId");
