/**
 * Calculates the total rate for a trip.
 *
 * @param rate - The base rate for the trip.
 * @param carrierFee - The carrier fee percentage to be applied to the base rate.
 * @returns The calculated total rate.
 */
export const calculateTotalRate = (
  rate: number,
  carrierFee: number,
): number => {
  const feeAmount = rate * carrierFee;
  const total = rate - feeAmount;

  return Math.round(total * 10000) / 10000;
};
