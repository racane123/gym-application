/*
  Warnings:

  - You are about to drop the column `months` on the `Renewal` table. All the data in the column will be lost.
  - Added the required column `previousEndDate` to the `Renewal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Renewal" DROP COLUMN "months";

-- First add the column as nullable
ALTER TABLE "Renewal" ADD COLUMN "previousEndDate" TIMESTAMP(3);

-- Update existing records (assuming previousEndDate should be the same as renewedAt for existing records)
UPDATE "Renewal" SET "previousEndDate" = "renewedAt";

-- Now make the column required
ALTER TABLE "Renewal" ALTER COLUMN "previousEndDate" SET NOT NULL;
