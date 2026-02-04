-- AlterTable: Add default value to updatedAt column for User table
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;