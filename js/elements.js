window.createWeekSummary = function(week, weekNumber, totalWeeks, useKm) {
    const actualRuns = week.runs.filter(run => run.type !== 'Rest');
    const totalDistance = actualRuns.reduce((sum, run) => sum + run.distance, 0);
    const distance = useKm ? totalDistance : convertToKm(totalDistance);

    const summaryEl = document.createElement('div');
    summaryEl.className = 'week-summary';

    const weeksUntilRace = totalWeeks - weekNumber;  // Changed to count up from start

    summaryEl.innerHTML = `
        <div class="week-summary-title">Week ${weekNumber} of ${totalWeeks}</div>
        <div class="week-dates">${getDateRange(week)}</div>
        <div class="total-distance">Weekly distance: ${distance}km</div>
        <div class="week-countdown">${weeksUntilRace} week(s) until race day</div>
    `;

    return summaryEl;
}

window.createDayElement = function(day, useKm) {
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

window.createNavigationButtons = function(isTop) {
    const navEl = document.createElement('div');
    navEl.className = 'week-navigation';

    const prevButton = document.createElement('button');
    prevButton.className = 'nav-button';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevButton.onclick = () => window.scrollToPrevWeek();

    const middleButton = document.createElement('button');
    middleButton.className = 'nav-button';
    if (isTop) {
        middleButton.innerHTML = 'Today';
        middleButton.onclick = () => window.scrollToCurrentWeek();
    } else {
        middleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Top';
        middleButton.onclick = () => window.scrollToTop();
    }

    const nextButton = document.createElement('button');
    nextButton.className = 'nav-button';
    nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextButton.onclick = () => window.scrollToNextWeek();

    navEl.appendChild(prevButton);
    navEl.appendChild(middleButton);
    navEl.appendChild(nextButton);

    return navEl;
}

window.createWeekElement = function(week, weekNumber, totalWeeks, useKm) {
    const weekEl = document.createElement('div');
    weekEl.className = 'week';
    
    // Add top navigation buttons
    weekEl.appendChild(createNavigationButtons(true));
    
    weekEl.appendChild(createWeekSummary(week, weekNumber, totalWeeks, useKm));

    // Get all days in the week
    const dates = week.runs.map(run => new Date(run.date));
    const monday = new Date(Math.min(...dates.map(d => d.getTime())));
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }

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

    // Add bottom navigation buttons
    weekEl.appendChild(createNavigationButtons(false));

    return weekEl;
}