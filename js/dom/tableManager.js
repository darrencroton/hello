import { formatTime } from '../utils/formatUtils.js';

// Display weekly data in the table
function displayWeeklyData(weeklyData) {
    const tableBody = document.getElementById('weeklyDataBody');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

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

export { displayWeeklyData };