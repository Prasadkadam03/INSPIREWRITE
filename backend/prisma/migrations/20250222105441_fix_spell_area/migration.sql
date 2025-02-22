/*
  Warnings:

  - You are about to drop the column `Area` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "Area",
ADD COLUMN     "area" TEXT NOT NULL DEFAULT 'other';
