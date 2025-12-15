-- DropForeignKey
ALTER TABLE "ItemsCars" DROP CONSTRAINT "ItemsCars_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ItemsCars" DROP CONSTRAINT "ItemsCars_modelId_fkey";

-- AlterTable
ALTER TABLE "ItemsCars" ALTER COLUMN "status" SET DEFAULT 'available';

-- AddForeignKey
ALTER TABLE "ItemsCars" ADD CONSTRAINT "ItemsCars_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsCars" ADD CONSTRAINT "ItemsCars_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
