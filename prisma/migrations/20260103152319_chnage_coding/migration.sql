/*
  Warnings:

  - You are about to drop the column `quantity` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Company` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED');

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "quantity",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "verified",
ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING';
