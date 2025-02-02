import { defaultChartOptions, chartColors, getWeekLabels } from './chartUtils.js';

function updatePaceChart(weeklyData) {
    const ctx = document.getElementById('paceChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getWeekLabels(weeklyData),
            datasets: [{
                label: 'Pace (min/km)',
                data: weeklyData.map(w => (w.timeRun / 60) / w.kmRun),  // Convert to minutes per km
                backgroundColor: chartColors.pace.background,
                borderColor: chartColors.pace.border,
                borderWidth: 1
            }]
        },
        options: defaultChartOptions
    });
}

export { updatePaceChart };