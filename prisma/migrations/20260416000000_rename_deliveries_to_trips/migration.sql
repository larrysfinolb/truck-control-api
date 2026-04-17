ALTER TYPE "DeliveryType" RENAME TO "TripType";

ALTER TYPE "TripType" RENAME VALUE 'MILEAGE_BASED' TO 'PER_MILE';

ALTER TABLE "deliveries" RENAME TO "trips";

ALTER TABLE "expenses" RENAME COLUMN "delivery_id" TO "trip_id";

ALTER TABLE "trips" RENAME CONSTRAINT "deliveries_pkey" TO "trips_pkey";
ALTER TABLE "trips" RENAME CONSTRAINT "deliveries_user_id_fkey" TO "trips_user_id_fkey";
ALTER TABLE "trips" RENAME CONSTRAINT "deliveries_vehicle_id_fkey" TO "trips_vehicle_id_fkey";
ALTER TABLE "trips" RENAME CONSTRAINT "deliveries_driver_id_fkey" TO "trips_driver_id_fkey";

ALTER TABLE "expenses" RENAME CONSTRAINT "expenses_delivery_id_fkey" TO "expenses_trip_id_fkey";