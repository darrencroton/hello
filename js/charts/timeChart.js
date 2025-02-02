import { defaultChartOptions, chartColors, getWeekLabels } from './chartUtils.js';

function updateTimeChart(weeklyData) {
    const ctx = document.getElementById('timeChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getWeekLabels(weeklyData),
            datasets: [{
                label: 'Time (hours)',
                data: weeklyData.map(w => w.timeRun / 3600),  // Convert seconds to hours
                backgroundColor: chartColors.time.background,
                borderColor: chartColors.time.border,
                borderWidth: 1
            }]
        },
        options: defaultChartOptions
    });
}

export { updateTimeChart };