import { defaultChartOptions, chartColors, getWeekLabels } from './chartUtils.js';

function updateDistanceChart(weeklyData) {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getWeekLabels(weeklyData),
            datasets: [{
                label: 'Distance (km)',
                data: weeklyData.map(w => w.kmRun),
                backgroundColor: chartColors.distance.background,
                borderColor: chartColors.distance.border,
                borderWidth: 1
            }]
        },
        options: defaultChartOptions
    });
}

export { updateDistanceChart };