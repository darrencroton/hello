import { createWeek } from './components/Week.js';
import { initializeScroll } from './scroll.js';

/**
 * Fetch training data from JSON file
 * @returns {Promise<Object>} Training data object
 */
async function fetchTrainingData() {
    try {
        const response = await fetch('data/training.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading training data:', error);
        return null;
    }
}

/**
 * Find the index of the current week or nearest future week
 * @param {Array} weeks - Array of week objects
 * @returns {number} Index of current/nearest week
 */
function findCurrentWeekIndex(weeks) {
    const now = new Date();
    
    // First try to find the current week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        const monday = new Date(Math.min(...weekDates.map(d => d.getTime())));
        while (monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        if (now >= monday && now <= sunday) {
            return i;
        }
    }
    
    // If no current week found, find the closest future week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        const monday = new Date(Math.min(...weekDates.map(d => d.getTime())));
        if (monday > now) {
            return i;
        }
    }
    
    return 0;
}

/**
 * Initialize the training log application
 */
async function initializeApp() {
    const appElement = document.getElementById('app');
    
    // Fetch data
    const data = await fetchTrainingData();
    if (!data) {
        appElement.innerHTML = '<div class="loading">Error loading training data</div>';
        return;
    }

    // Create week container
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-container';
    
    // Add weeks to container
    data.weeks.forEach((week, index) => {
        const weekNumber = data.weeks.length - index;
        weekContainer.appendChild(createWeek(week, weekNumber, data.weeks.length, data.units === 'kilometers'));
    });
    
    // Replace loading message with week container
    appElement.innerHTML = '';
    appElement.appendChild(weekContainer);

    // Scroll to current week
    const currentWeekIndex = findCurrentWeekIndex(data.weeks);
    weekContainer.scrollLeft = currentWeekIndex * window.innerWidth;

    // Initialize scroll behavior
    initializeScroll(weekContainer);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);