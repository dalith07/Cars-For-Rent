/*
  Warnings:

  - You are about to drop the column `setupStatus` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "setupStatus",
ADD COLUMN     "setupCompleted" BOOLEAN NOT NULL DEFAULT false;
