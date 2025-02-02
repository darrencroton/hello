import { formatDate, getDateRange, getMondayOfWeek } from './dateUtils.js';
import { convertToKm } from './utils.js';

function createWeekSummary(week, weekNumber, totalWeeks, useKm) {
    const actualRuns = week.runs.filter(run => run.type !== 'Rest');
    const totalDistance = actualRuns.reduce((sum, run) => sum + run.distance, 0);
    const distance = useKm ? totalDistance : convertToKm(totalDistance);

    const summaryEl = document.createElement('div');
    summaryEl.className = 'week-summary';

    const weeksUntilRace = totalWeeks - weekNumber;

    summaryEl.innerHTML = `
        <div class="week-summary-title">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="week-dates">${getDateRange(week)}</div>
        <div class="total-distance">Weekly distance: ${distance}km</div>
        <div class="week-countdown">${weeksUntilRace} week(s) until race day</div>
    `;

    return summaryEl;
}

function createDayElement(day, useKm) {
    const dayEl = document.createElement('div');
    dayEl.className = 'run-card' + (day.type === 'Rest' ? ' rest-day' : '');
    
    const distance = day.distance ? (useKm ? day.distance : convertToKm(day.distance)) : 0;
    dayEl.innerHTML = `
        <div class="run-date">${formatDate(day.date)}</div>
        <div class="run-type">${day.type}</div>
        ${distance > 0 ? `
            <div class="stat">
                <div class="stat-value">${distance}km</div>
                <div class="stat-label">Distance</div>
            </div>
        ` : ''}
        ${day.notes ? `<div class="run-notes">${day.notes}</div>` : ''}
    `;
    
    return dayEl;
}

function createWeekElement(week, weekNumber, totalWeeks, useKm, headerHeight) {
    const weekEl = document.createElement('div');
    weekEl.className = 'week';
    
    weekEl.appendChild(createWeekSummary(week, weekNumber, totalWeeks, useKm));

    // Get Monday of the week and create array of all days
    const dates = week.runs.map(run => new Date(run.date));
    const monday = getMondayOfWeek(Math.min(...dates.map(d => d.getTime())));

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
                type: 'Rest',
                distance: 0,
                notes: ''
            });
        }
    }

    allDays.forEach((day, index) => {
        weekEl.appendChild(createDayElement(day, useKm));
        
        if (index < allDays.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'week-divider';
            weekEl.appendChild(divider);
        }
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