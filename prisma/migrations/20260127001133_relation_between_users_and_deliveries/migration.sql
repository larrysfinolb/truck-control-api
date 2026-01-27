/*
  Warnings:

  - Added the required column `user_id` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliveries" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
