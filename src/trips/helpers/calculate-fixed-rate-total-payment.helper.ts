import { roundToScale } from '../../common/utils/roundToScale.utils.js';

/**
 * Calculates the final total payment for a fixed-rate trip.
 *
 * The formula subtracts the carrier fee amount from the base trip rate.
 * Both values are expected to be already normalized as numbers.
 *
 * @param rate Base amount charged for the trip.
 * @param carrierFee Carrier fee percentage expressed as a decimal value.
 * @returns The net total payment rounded to 4 decimal places.
 */
export const calculateFixedRateTotalPayment = (
  rate: number,
  carrierFee: number,
): number => {
  return roundToScale(rate - rate * carrierFee);
};
