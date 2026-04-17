import { roundToScale } from '../../common/utils/roundToScale.utils.js';

/**
 * Calculates the final total payment for a per-mile trip.
 *
 * The formula adds the loaded-mile payment and the deadhead-mile payment.
 * All input values are expected to be already normalized as numbers.
 *
 * @param miles Loaded miles driven during the trip.
 * @param ratePerMile Amount paid per loaded mile.
 * @param deadheadMiles Empty miles driven during the trip.
 * @param ratePerDeadheadMile Amount paid per deadhead mile.
 * @returns The total payment rounded to 4 decimal places.
 */
export const calculatePerMileTotalPayment = (
  miles: number,
  ratePerMile: number,
  deadheadMiles: number,
  ratePerDeadheadMile: number,
): number => {
  return roundToScale(
    miles * ratePerMile + deadheadMiles * ratePerDeadheadMile,
  );
};
