window.fetchTrainingData = async function() {
    try {
        const response = await fetch('data/training.json');
        const data = await response.json();
        window.trainingData = data; // Make data globally accessible
        return data;
    } catch (error) {
        console.error('Error loading training data:', error);
        return null;
    }
}

window.formatDate = function(dateStr) {
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

window.getDateRange = function(week) {
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

window.convertToKm = function(miles) {
    return (miles * 1.60934).toFixed(1);
}

window.findCurrentWeekIndex = function(weeks) {
    const now = new Date();
    
    // First try to find the current week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        const monday = new Date(Math.min(...weekDates.map(d => d.getTime())));
        while (monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        if (now >= monday && now <= sunday) {
            return i;
        }
    }
    
    // If no current week found, find the closest future week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        const monday = new Date(Math.min(...weekDates.map(d => d.getTime())));
        if (monday > now) {
            return i;
        }
    }
    
    return 0;
}