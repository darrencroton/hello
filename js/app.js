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

    // Add scroll event listener to scroll to top when changing weeks
    let lastScrollLeft = weekContainer.scrollLeft;
    weekContainer.addEventListener('scroll', () => {
        const currentScrollLeft = weekContainer.scrollLeft;
        const weekWidth = window.innerWidth;
        
        // Check if we've scrolled to a new week
        if (Math.abs(currentScrollLeft - lastScrollLeft) >= weekWidth / 2) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            lastScrollLeft = Math.round(currentScrollLeft / weekWidth) * weekWidth;
        }
    });

    // Add touch event listeners for smoother scrolling behavior
    let touchStartX = 0;
    let touchStartScroll = 0;
    let isDragging = false;

    weekContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartScroll = weekContainer.scrollLeft;
        isDragging = false;
    });

    weekContainer.addEventListener('touchmove', (e) => {
        const touchDelta = touchStartX - e.touches[0].clientX;
    
        // Add a small threshold to distinguish between scroll and tap
        if (Math.abs(touchDelta) > 10) {
            isDragging = true;
            e.preventDefault(); // Prevent default scroll only if we're actually dragging
            weekContainer.scrollLeft = touchStartScroll + touchDelta;
        }
    });

    weekContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return; // Ignore if it was just a tap

        const weekWidth = window.innerWidth;
        const currentWeek = Math.round(weekContainer.scrollLeft / weekWidth);
    
        weekContainer.scrollTo({
            left: currentWeek * weekWidth,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);
