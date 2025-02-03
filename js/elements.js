import { formatDate, getDateRange, getMondayOfWeek } from './dateUtils.js';
import { formatDistance } from './units.js';
import { CLASSES, RUN_TYPES } from './constants.js';

function createWeekSummary(week, weekNumber, totalWeeks, useKm) {
    const actualRuns = week.runs.filter(run => run.type !== RUN_TYPES.REST);
    const totalDistance = actualRuns.reduce((sum, run) => sum + run.distance, 0);
    const distance = formatDistance(totalDistance, useKm);

    const summaryEl = document.createElement('div');
    summaryEl.className = CLASSES.WEEK_SUMMARY;

    const weeksUntilRace = totalWeeks - weekNumber;

    summaryEl.innerHTML = `
        <div class="week-summary-title">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="week-dates">${getDateRange(week)}</div>
        <div class="week-countdown">${weeksUntilRace} week(s) until race day</div>
        <div class="total-distance">Weekly distance: ${distance} km</div>
    `;

    return summaryEl;
}

function createDayElement(day, useKm) {
    const dayEl = document.createElement('div');
    dayEl.className = CLASSES.RUN_CARD + (day.type === RUN_TYPES.REST ? ` ${CLASSES.REST_DAY}` : '');
    
    const distance = day.distance ? formatDistance(day.distance, useKm) : 0;
    dayEl.innerHTML = `
        <div class="run-date">${formatDate(day.date)}</div>
        <div class="run-type">${day.type}</div>
        ${distance > 0 ? `
            <div class="stat">
                <div class="stat-value">${distance} km</div>
                <div class="stat-label">Distance</div>
            </div>
        ` : ''}
        ${day.notes ? `<div class="run-notes">${day.notes}</div>` : ''}
    `;
    
    return dayEl;
}

function createWeekElement(week, weekNumber, totalWeeks, useKm, headerHeight) {
    const weekEl = document.createElement('div');
    weekEl.className = CLASSES.WEEK;
    
    weekEl.appendChild(createWeekSummary(week, weekNumber, totalWeeks, useKm));

    // Get monday from the week's start date
    const monday = new Date(week.startDate);

    // Create an array of all days in the week
    const allDays = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Find if there's a run on this day
        const run = week.runs.find(r => r.date === dateStr);
        
        if (run) {
            allDays.push(run);
        } else {
            allDays.push({
                date: dateStr,
                type: RUN_TYPES.REST,
                distance: 0,
                notes: ''
            });
        }
    }

    allDays.forEach(day => {
        weekEl.appendChild(createDayElement(day, useKm));
    });

    // Add Top button
    const topButton = document.createElement('button');
    topButton.className = 'top-button';
    topButton.textContent = 'Top';
    topButton.addEventListener('click', () => {
        const weekTop = weekEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: weekTop - headerHeight,
            behavior: 'smooth'
        });
    });
    weekEl.appendChild(topButton);
    
    return weekEl;
}

export {
    createWeekElement
};
