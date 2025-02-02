import { updateDistanceChart } from './charts/distanceChart.js';
import { updateTimeChart } from './charts/timeChart.js';
import { updateElevationChart } from './charts/elevationChart.js';
import { updatePaceChart } from './charts/paceChart.js';
import { initializeData, setAvailableWeeks } from './data/dataLoader.js';
import { displayWeeklyData } from './dom/tableManager.js';

// Update all charts with new data
function updateCharts(weeklyData) {
    updateDistanceChart(weeklyData);
    updateTimeChart(weeklyData);
    updateElevationChart(weeklyData);
    updatePaceChart(weeklyData);
}

// Handle data updates
function handleDataUpdate(weeklyData) {
    displayWeeklyData(weeklyData);
    updateCharts(weeklyData);
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set list of available week files
    setAvailableWeeks([1, 2, 3, 4, 5, 6, 7, 8]);  // Example - replace with actual week numbers
    
    // Start loading data
    initializeData(handleDataUpdate);
});