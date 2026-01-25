-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('FIXED_RATE', 'MILEAGE_BASED');

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "type" "DeliveryType" NOT NULL,
    "vehicle" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "pickup_date" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "rate" DECIMAL(12,4),
    "carrier_fee" DECIMAL(12,4),
    "miles" DECIMAL(12,4),
    "rate_per_mile" DECIMAL(12,4),
    "deadhead_miles" DECIMAL(12,4),
    "rate_per_deadhead_mile" DECIMAL(12,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);
