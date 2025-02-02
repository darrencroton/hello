import { defaultChartOptions, chartColors, getWeekLabels } from './chartUtils.js';

function updateElevationChart(weeklyData) {
    const ctx = document.getElementById('elevationChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getWeekLabels(weeklyData),
            datasets: [{
                label: 'Elevation (m)',
                data: weeklyData.map(w => w.elevation),
                backgroundColor: chartColors.elevation.background,
                borderColor: chartColors.elevation.border,
                borderWidth: 1
            }]
        },
        options: defaultChartOptions
    });
}

export { updateElevationChart };