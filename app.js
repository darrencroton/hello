// Configuration
const config = {
    dataDir: 'data/',
    weeks: [],  // Will be populated with available week numbers
};

// Load and parse a week file
async function loadWeekFile(weekNum) {
    const response = await fetch(`${config.dataDir}week${weekNum}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { weekNum, ...data };
}

// Get sorted list of available week numbers
function getAllWeekNumbers() {
    return config.weeks.sort((a, b) => a - b);
}

// Get current week number
function getCurrentWeek() {
    return Math.max(...getAllWeekNumbers());
}

// Load just the current week initially, then load all weeks
async function loadInitialData() {
    // Phase 1: Load and display current week
    const currentWeek = getCurrentWeek();
    const weekData = await loadWeekFile(currentWeek);
    displayWeeklyData([weekData]);
    updateCharts([weekData]);
    
    // Phase 2: Load all weeks in background
    const allData = await loadAllWeekData();
    displayWeeklyData(allData);
    updateCharts(allData);
}

// Load all week files
async function loadAllWeekData() {
    const weekNumbers = getAllWeekNumbers();
    const weekData = await Promise.all(
        weekNumbers.map(week => loadWeekFile(week))
    );
    return weekData.sort((a, b) => a.weekNum - b.weekNum);
}

// Display weekly data in the table
function displayWeeklyData(weeklyData) {
    const tableBody = document.getElementById('weeklyDataBody');
    tableBody.innerHTML = '';  // Clear existing rows
    
    weeklyData.forEach(week => {
        const row = document.createElement('tr');
        
        // Add week number
        const weekCell = document.createElement('td');
        weekCell.textContent = week.weekNum;
        row.appendChild(weekCell);
        
        // Add Km Run
        const kmCell = document.createElement('td');
        kmCell.textContent = week.kmRun.toFixed(1);
        row.appendChild(kmCell);
        
        // Add Time Run
        const timeCell = document.createElement('td');
        timeCell.textContent = formatTime(week.timeRun);
        row.appendChild(timeCell);
        
        // Add Elevation
        const elevCell = document.createElement('td');
        elevCell.textContent = week.elevation;
        row.appendChild(elevCell);
        
        tableBody.appendChild(row);
    });
}

// Format seconds into HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

// Pad numbers with leading zero if needed
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Update all charts with new data
function updateCharts(weeklyData) {
    updateDistanceChart(weeklyData);
    updateTimeChart(weeklyData);
    updateElevationChart(weeklyData);
    updatePaceChart(weeklyData);
}

// Update Distance Chart
function updateDistanceChart(weeklyData) {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(w => `Week ${w.weekNum}`),
            datasets: [{
                label: 'Distance (km)',
                data: weeklyData.map(w => w.kmRun),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Time Chart
function updateTimeChart(weeklyData) {
    const ctx = document.getElementById('timeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(w => `Week ${w.weekNum}`),
            datasets: [{
                label: 'Time (hours)',
                data: weeklyData.map(w => w.timeRun / 3600),  // Convert seconds to hours
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Elevation Chart
function updateElevationChart(weeklyData) {
    const ctx = document.getElementById('elevationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(w => `Week ${w.weekNum}`),
            datasets: [{
                label: 'Elevation (m)',
                data: weeklyData.map(w => w.elevation),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Pace Chart
function updatePaceChart(weeklyData) {
    const ctx = document.getElementById('paceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(w => `Week ${w.weekNum}`),
            datasets: [{
                label: 'Pace (min/km)',
                data: weeklyData.map(w => (w.timeRun / 60) / w.kmRun),  // Convert to minutes per km
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get list of available week files (you'll need to implement this)
    config.weeks = [1, 2, 3, 4, 5, 6, 7, 8];  // Example - replace with actual week numbers
    
    // Start loading data
    loadInitialData();
});