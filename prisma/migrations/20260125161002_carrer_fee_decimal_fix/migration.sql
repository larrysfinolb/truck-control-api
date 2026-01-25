/*
  Warnings:

  - You are about to alter the column `carrier_fee` on the `deliveries` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,4)` to `Decimal(5,4)`.

*/
-- AlterTable
ALTER TABLE "deliveries" ALTER COLUMN "carrier_fee" SET DATA TYPE DECIMAL(5,4);
