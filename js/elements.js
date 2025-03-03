import { formatDate, getDateRange, getMondayOfWeek } from './dateUtils.js';
import { formatDistance } from './units.js';
import { CLASSES, RUN_TYPES } from './constants.js';

function createWeekSummary(week, weekNumber, totalWeeks, useKm) {
    const actualRuns = week.runs.filter(run => run.type !== RUN_TYPES.REST && run.type !== 'Rest Day');
    
    // Calculate planned total distance
    const plannedTotalDistance = actualRuns.reduce((sum, run) => sum + (run.distance || 0), 0);
    
    // Calculate actual total distance if available
    const hasActualDistances = actualRuns.some(run => run.actualDistance !== undefined && run.actualDistance !== null);
    
    let actualTotalDistance = 0;
    if (hasActualDistances) {
        actualTotalDistance = actualRuns.reduce((sum, run) => {
            // If actual distance is available for this run, use it, otherwise use planned
            const distanceToAdd = (run.actualDistance !== undefined && run.actualDistance !== null) 
                ? run.actualDistance 
                : (run.distance || 0);
            return sum + distanceToAdd;
        }, 0);
    }
    
    const plannedDistance = formatDistance(plannedTotalDistance, useKm);
    const actualDistance = formatDistance(actualTotalDistance, useKm);

    const summaryEl = document.createElement('div');
    summaryEl.className = CLASSES.WEEK_SUMMARY;

    const weeksUntilRace = totalWeeks - weekNumber;

    // Choose the appropriate distance display format
    let distanceDisplay = '';
    if (hasActualDistances) {
        distanceDisplay = `Distance: ${plannedDistance} km (actual: ${actualDistance} km)`;
    } else {
        distanceDisplay = `Distance: ${plannedDistance} km`;
    }

    summaryEl.innerHTML = `
        <div class="week-summary-title">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="week-progress">${getDateRange(week)}</div>
        <div class="countdown">${weeksUntilRace} week(s) until race day</div>
        <div class="total-distance">${distanceDisplay}</div>
    `;

    return summaryEl;
}

function createDayElement(day, useKm) {
    const dayEl = document.createElement('div');
    dayEl.className = CLASSES.RUN_CARD + (day.type === RUN_TYPES.REST || day.type === 'Rest Day' ? ` ${CLASSES.REST_DAY}` : '');
    
    // Get planned and actual distances
    const plannedDistance = day.distance ? formatDistance(day.distance, useKm) : 0;
    const hasActualDistance = day.actualDistance !== undefined && day.actualDistance !== null;
    const actualDistance = hasActualDistance ? formatDistance(day.actualDistance, useKm) : null;
    
    // Determine distance display text
    let distanceDisplay = plannedDistance;
    if (hasActualDistance && Math.abs(day.distance - day.actualDistance) > 0.1) {
        distanceDisplay = `${plannedDistance} km (actual: ${actualDistance} km)`;
    } else if (plannedDistance > 0) {
        distanceDisplay = `${plannedDistance} km`;
    }
    
    // Get planned and actual notes (supporting both note formats)
    const plannedNotes = day.planned || day.notes || '';
    const actualNotes = day.actual || '';
    
    dayEl.innerHTML = `
        <div class="run-date">${formatDate(day.date)}</div>
        <div class="run-type">${day.type}</div>
        ${plannedDistance > 0 ? `
            <div class="stat">
                <div class="stat-value">${distanceDisplay}</div>
                <div class="stat-label">Distance</div>
            </div>
        ` : ''}
        ${plannedNotes ? `
            <div class="run-notes">
                <div class="planned-run"><strong>Planned:</strong> ${plannedNotes}</div>
                ${actualNotes ? `<div class="actual-run"><strong>Notes:</strong> ${actualNotes}</div>` : ''}
            </div>
        ` : ''}
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    weekEl.appendChild(topButton);
    
    return weekEl;
}

export {
    createWeekElement
};
