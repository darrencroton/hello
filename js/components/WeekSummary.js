import { getDateRange, calculateWeeksUntilRace } from '../utils/dateUtils.js';
import { calculateWeeklyDistance } from '../utils/distanceUtils.js';

/**
 * Creates and returns a week summary element
 * @param {Object} week - Week data object
 * @param {number} weekNumber - Current week number
 * @param {number} totalWeeks - Total number of weeks in program
 * @param {boolean} useKm - Whether to display distances in kilometers
 * @returns {HTMLElement} Week summary element
 */
export function createWeekSummary(week, weekNumber, totalWeeks, useKm) {
    const summaryEl = document.createElement('div');
    summaryEl.className = 'week-summary';

    const distance = calculateWeeklyDistance(week, useKm);
    const weeksUntilRace = calculateWeeksUntilRace();

    summaryEl.innerHTML = `
        <div class="week-summary-title">${getDateRange(week)}</div>
        <div class="week-progress">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="countdown">${weeksUntilRace} weeks until race day</div>
        <div class="total-distance">Weekly distance: ${distance}km</div>
    `;

    return summaryEl;
}