async function initializeApp() {
    const data = await window.fetchTrainingData();
    if (!data) {
        document.getElementById('app').innerHTML = '<div class="loading">Error loading training data</div>';
        return;
    }

    const useKm = data.units === 'kilometers';
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-container';

    // Calculate total weeks in the program
    const totalWeeks = data.weeks.length;

    // Find the start date of the program (first Monday)
    const firstWeekDates = data.weeks[data.weeks.length - 1].runs.map(run => new Date(run.date));
    const programStart = new Date(Math.min(...firstWeekDates.map(d => d.getTime())));
    while (programStart.getDay() !== 1) {
        programStart.setDate(programStart.getDate() - 1);
    }

    data.weeks.forEach((week, index) => {
        const weekNumber = data.weeks.length - index;  // Count down from total weeks
        weekContainer.appendChild(createWeekElement(week, weekNumber, totalWeeks, useKm));
    });

    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(weekContainer);

    // Scroll to current/closest week
    const currentWeekIndex = findCurrentWeekIndex(data.weeks);
    const weekWidth = window.innerWidth;
    weekContainer.scrollLeft = currentWeekIndex * weekWidth;
}

document.addEventListener('DOMContentLoaded', initializeApp);