async function initializeApp() {
    const data = await window.fetchTrainingData();
    if (!data) {
        document.getElementById('app').innerHTML = '<div class="loading">Error loading training data</div>';
        return;
    }

    const useKm = data.units === 'kilometers';
    
    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    
    // Create navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-container';
    navContainer.innerHTML = `
        <button id="prevWeek" class="nav-button">Previous</button>
        <button id="todayWeek" class="nav-button">Today</button>
        <button id="nextWeek" class="nav-button">Next</button>
    `;
    mainContainer.appendChild(navContainer);
    
    // Create week container
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-container';
    mainContainer.appendChild(weekContainer);

    const totalWeeks = data.weeks.length;

    data.weeks.forEach((week, index) => {
        const weekNumber = data.weeks.length - index;
        weekContainer.appendChild(createWeekElement(week, weekNumber, totalWeeks, useKm));
    });

    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(mainContainer);

    // Navigation functions
    function scrollToWeek(weekIndex) {
        const weekWidth = window.innerWidth;
        weekContainer.scrollTo({
            left: weekIndex * weekWidth,
            behavior: 'smooth'
        });
    }

    const currentWeekIndex = findCurrentWeekIndex(data.weeks);
    
    // Initial scroll to current week
    scrollToWeek(currentWeekIndex);

    // Add click handlers for navigation buttons
    document.getElementById('prevWeek').addEventListener('click', () => {
        const currentScroll = weekContainer.scrollLeft;
        const weekWidth = window.innerWidth;
        const currentIndex = Math.round(currentScroll / weekWidth);
        if (currentIndex > 0) {
            scrollToWeek(currentIndex - 1);
        }
    });

    document.getElementById('todayWeek').addEventListener('click', () => {
        scrollToWeek(currentWeekIndex);
    });

    document.getElementById('nextWeek').addEventListener('click', () => {
        const currentScroll = weekContainer.scrollLeft;
        const weekWidth = window.innerWidth;
        const currentIndex = Math.round(currentScroll / weekWidth);
        if (currentIndex < totalWeeks - 1) {
            scrollToWeek(currentIndex + 1);
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);