/**
 * Rounds a numeric value to the specified number of decimal places.
 *
 * @param value Numeric value to round.
 * @param scale Number of decimal places to preserve. Defaults to `4`.
 * @returns The rounded numeric value.
 */
export const roundToScale = (value: number, scale = 4): number => {
  const factor = 10 ** scale;

  return Math.round(value * factor) / factor;
};
