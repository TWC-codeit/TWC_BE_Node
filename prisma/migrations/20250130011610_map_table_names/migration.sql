/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scrap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Timeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimelineItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scrap" DROP CONSTRAINT "Scrap_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Scrap" DROP CONSTRAINT "Scrap_userId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_scrapId_fkey";

-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_timelineId_fkey";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Scrap";

-- DropTable
DROP TABLE "Timeline";

-- DropTable
DROP TABLE "TimelineItem";

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraps" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_items" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timelineId" INTEGER NOT NULL,
    "scrapId" INTEGER NOT NULL,

    CONSTRAINT "timeline_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timeline_items_timelineId_scrapId_key" ON "timeline_items"("timelineId", "scrapId");

-- AddForeignKey
ALTER TABLE "scraps" ADD CONSTRAINT "scraps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraps" ADD CONSTRAINT "scraps_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_items" ADD CONSTRAINT "timeline_items_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "timelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_items" ADD CONSTRAINT "timeline_items_scrapId_fkey" FOREIGN KEY ("scrapId") REFERENCES "scraps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
