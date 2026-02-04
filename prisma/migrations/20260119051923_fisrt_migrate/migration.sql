/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER', 'PAYMENT', 'ALERT');

-- CreateEnum
CREATE TYPE "SetupStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankHolder" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentUrl" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "setupStatus" "SetupStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "NotificationType" NOT NULL;
