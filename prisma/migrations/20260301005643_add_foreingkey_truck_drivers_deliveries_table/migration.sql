/*
  Warnings:

  - You are about to drop the column `driver` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle` on the `deliveries` table. All the data in the column will be lost.
  - Added the required column `driver_id` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "driver",
DROP COLUMN "vehicle",
ADD COLUMN     "driver_id" TEXT NOT NULL,
ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "trucks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
