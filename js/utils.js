function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    function getOrdinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    
    return `${days[date.getDay()]} ${getOrdinal(date.getDate())} ${months[date.getMonth()]}`;
}

function getDateRange(week) {
    const dates = week.runs.map(run => new Date(run.date));
    const monday = new Date(Math.min(...dates.map(d => d.getTime())));
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    function getOrdinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    
    if (monday.getMonth() === sunday.getMonth()) {
        return `${getOrdinal(monday.getDate())} - ${getOrdinal(sunday.getDate())} ${months[monday.getMonth()]}`;
    } else {
        return `${getOrdinal(monday.getDate())} ${months[monday.getMonth()]} - ${getOrdinal(sunday.getDate())} ${months[sunday.getMonth()]}`;
    }
}

function convertToKm(miles) {
    return (miles * 1.60934).toFixed(1);
}

function calculateWeeksUntilRace() {
    const raceDay = new Date(2025, 3, 27); // April 27th 2025
    const today = new Date();
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    
    const weeksDifference = Math.floor((raceDay - today) / millisecondsPerWeek);
    return weeksDifference > 0 ? weeksDifference : 0;
}

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