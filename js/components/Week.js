import { createWeekSummary } from './WeekSummary.js';
import { createRunCard, createDivider } from './RunCard.js';

/**
 * Get all days in a week, filling in rest days for missing dates
 * @param {Array} runs - Array of run objects for the week
 * @returns {Array} Complete array of day objects for the week
 */
function getAllDaysInWeek(runs) {
    const dates = runs.map(run => new Date(run.date));
    const monday = new Date(Math.min(...dates.map(d => d.getTime())));
    
    // Adjust to Monday
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }

    const allDays = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Find if there's a run on this day
        const run = runs.find(r => r.date === dateStr);
        
        allDays.push(run || {
            date: dateStr,
            type: 'Rest',
            distance: 0,
            notes: ''
        });
    }

    return allDays;
}

/**
 * Creates a complete week view element
 * @param {Object} week - Week data object
 * @param {number} weekNumber - Current week number
 * @param {number} totalWeeks - Total number of weeks in program
 * @param {boolean} useKm - Whether to display distances in kilometers
 * @returns {HTMLElement} Week element
 */
export function createWeek(week, weekNumber, totalWeeks, useKm) {
    const weekEl = document.createElement('div');
    weekEl.className = 'week';
    
    // Add week summary
    weekEl.appendChild(createWeekSummary(week, weekNumber, totalWeeks, useKm));

    // Add all days
    const allDays = getAllDaysInWeek(week.runs);
    allDays.forEach((day, index) => {
        weekEl.appendChild(createRunCard(day, useKm));
        
        // Add divider between days (except after the last day)
        if (index < allDays.length - 1) {
            weekEl.appendChild(createDivider());
        }
    });

    return weekEl;
}