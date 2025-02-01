/**
 * Convert a distance in miles to kilometers
 * @param {number} miles - Distance in miles
 * @returns {string} Distance in kilometers, rounded to 1 decimal place
 */
export function convertToKm(miles) {
    return (miles * 1.60934).toFixed(1);
}

/**
 * Calculate total distance for a week excluding rest days
 * @param {Object} week - Week object containing runs
 * @param {boolean} useKm - Whether to return distance in kilometers
 * @returns {string} Total distance with 1 decimal place
 */
export function calculateWeeklyDistance(week, useKm) {
    const actualRuns = week.runs.filter(run => run.type !== 'Rest');
    const totalDistance = actualRuns.reduce((sum, run) => sum + run.distance, 0);
    return useKm ? totalDistance.toFixed(1) : convertToKm(totalDistance);
}