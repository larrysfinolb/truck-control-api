UPDATE "trips"
SET "total_payment" = "total_rate"
WHERE "total_rate" IS NOT NULL
  AND "total_payment" IS NULL;

ALTER TABLE "trips" DROP COLUMN "total_rate";