/*
  Warnings:

  - You are about to drop the column `title` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "title",
ADD COLUMN     "isPaid" TEXT DEFAULT 'Not Paid',
ADD COLUMN     "status" TEXT DEFAULT 'Processing';
