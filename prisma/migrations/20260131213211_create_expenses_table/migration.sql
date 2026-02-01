-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('FUEL', 'DEF', 'FEES', 'FIXED_COST', 'OTHER');

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "incurred_at" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,4) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
