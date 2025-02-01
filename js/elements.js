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