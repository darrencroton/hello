function createWeekSummary(week, weekNumber, totalWeeks, useKm) {
    // Calculate total distance excluding rest days
    const actualRuns = week.runs.filter(run => run.type !== 'Rest');
    const totalDistance = actualRuns.reduce((sum, run) => sum + run.distance, 0);
    const distance = useKm ? totalDistance : convertToKm(totalDistance);

    const summaryEl = document.createElement('div');
    summaryEl.className = 'week-summary';

    const weeksUntilRace = calculateWeeksUntilRace();

    summaryEl.innerHTML = `
        <div class="week-summary-title">${getDateRange(week)}</div>
        <div class="week-progress">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="countdown">${weeksUntilRace} weeks until race day</div>
        <div class="total-distance">Weekly distance: ${distance}km</div>
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