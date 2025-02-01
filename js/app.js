async function initializeApp() {
    const data = await window.fetchTrainingData();
    if (!data) {
        document.getElementById('app').innerHTML = '<div class="loading">Error loading training data</div>';
        return;
    }

    const useKm = data.units === 'kilometers';
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-container';

    const totalWeeks = data.weeks.length;

    data.weeks.forEach((week, index) => {
        const weekNumber = data.weeks.length - index;
        weekContainer.appendChild(createWeekElement(week, weekNumber, totalWeeks, useKm));
    });

    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(weekContainer);

    const currentWeekIndex = findCurrentWeekIndex(data.weeks);
    const weekWidth = window.innerWidth;
    weekContainer.scrollLeft = currentWeekIndex * weekWidth;
}

document.addEventListener('DOMContentLoaded', initializeApp);