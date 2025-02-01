// Format distance in kilometers
const formatDistance = (distance) => {
    return `${distance.toFixed(1)} km`;
};

// Format pace in minutes per kilometer
const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
};

// Create a run card element
const createRunCard = (run) => {
    const card = document.createElement('div');
    card.className = `run-card ${run.type === 'rest' ? 'rest-day' : ''}`;
    
    card.innerHTML = `
        <div class="run-info">
            <div class="run-title">${run.title}</div>
            <div class="run-details">${run.details || ''}</div>
        </div>
        <div class="run-stats">
            ${run.type !== 'rest' ? `
                <div class="run-distance">${formatDistance(run.distance)}</div>
                <div class="run-pace">${formatPace(run.pace)}</div>
            ` : ''}
        </div>
    `;
    
    return card;
};

// Create a week container
const createWeekContainer = (weekData) => {
    const container = document.createElement('div');
    container.className = 'week';
    
    const totalDistance = weekData.runs
        .filter(run => run.type !== 'rest')
        .reduce((sum, run) => sum + run.distance, 0);
    
    container.innerHTML = `
        <div class="week-header">
            <div class="week-title">${weekData.title}</div>
            <div class="week-summary">${formatDistance(totalDistance)}</div>
        </div>
    `;
    
    weekData.runs.forEach(run => {
        container.appendChild(createRunCard(run));
    });
    
    return container;
};

// Initialize the app
const initApp = async () => {
    try {
        const response = await fetch('data/training.json');
        const data = await response.json();
        
        const app = document.getElementById('app');
        app.innerHTML = ''; // Clear loading message
        
        data.weeks.forEach(week => {
            app.appendChild(createWeekContainer(week));
        });
    } catch (error) {
        console.error('Error loading training data:', error);
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Error loading training data</div>';
    }
};

// Start the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);