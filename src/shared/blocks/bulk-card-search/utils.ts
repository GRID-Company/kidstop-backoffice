import { BulkCardResult } from './types';

/**
 * Calculates the form field index for a result in the filtered results array.
 * Only valid cards (with bestMatch and no error) have form fields.
 * This function counts how many valid cards exist before the given index.
 *
 * @param results - Array of bulk card search results
 * @param resultIndex - Index of the result in the results array
 * @returns The corresponding index in the form fields array
 *
 * @example
 * // If results = [error, valid, valid, noMatch, valid]
 * // and resultIndex = 4 (last valid card)
 * // returns 2 (third form field, 0-indexed)
 */
export const getValidCardFormIndex = (
  results: BulkCardResult[],
  resultIndex: number
): number => {
  return results.slice(0, resultIndex).filter((r) => r.bestMatch && !r.error)
    .length;
};
