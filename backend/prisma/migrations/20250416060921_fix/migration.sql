-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_createdBy_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
