/**
 * Calculates the number of seats in each cabin class based on the total seats.
 * 
 * Rules:
 * - Economy = 75% of total seats
 * - Business = 20% of total seats
 * - First = 5% of total seats
 * 
 * The total sum is guaranteed to equal totalSeats.
 * 
 * @param {number} totalSeats 
 * @returns {{economy: number, business: number, first: number}}
 */
export const calculateSeatDistribution = (totalSeats) => {
  const parsedTotal = parseInt(totalSeats, 10) || 0;
  
  const economy = Math.round(parsedTotal * 0.75);
  const business = Math.round(parsedTotal * 0.20);
  
  // Adjust the last class (First Class) so the sum is exactly equal to totalSeats
  const first = parsedTotal - (economy + business);
  
  return {
    economy,
    business,
    first
  };
};
