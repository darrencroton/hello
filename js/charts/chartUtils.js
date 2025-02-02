// Common chart configuration and utilities
const defaultChartOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const chartColors = {
    distance: {
        background: 'rgba(54, 162, 235, 0.5)',
        border: 'rgba(54, 162, 235, 1)'
    },
    time: {
        background: 'rgba(255, 99, 132, 0.5)',
        border: 'rgba(255, 99, 132, 1)'
    },
    elevation: {
        background: 'rgba(75, 192, 192, 0.5)',
        border: 'rgba(75, 192, 192, 1)'
    },
    pace: {
        background: 'rgba(153, 102, 255, 0.5)',
        border: 'rgba(153, 102, 255, 1)'
    }
};

// Common function to get week labels
function getWeekLabels(weeklyData) {
    return weeklyData.map(w => `Week ${w.weekNum}`);
}

export { defaultChartOptions, chartColors, getWeekLabels };