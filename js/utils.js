window.getWeekFiles = async function() {
    const files = [];
    let weekNum = 1;
    
    while (true) {
        const paddedNum = weekNum.toString().padStart(3, '0');
        try {
            const response = await fetch(`data/week_${paddedNum}.json`);
            if (!response.ok) break;
            const weekData = await response.json();
            files.push(weekData);
            weekNum++;
        } catch {
            break;
        }
    }
    
    return files;
}

window.fetchTrainingData = async function() {
    try {
        // Get metadata first
        const metaResponse = await fetch('data/metadata.json');
        const metadata = await metaResponse.json();
        
        // Get all week files
        const weeks = await window.getWeekFiles();
        
        // Combine data - sort oldest to newest for proper display order
        return {
            racename: metadata.racename,
            raceday: metadata.raceday,
            units: metadata.units,
            weeks: weeks.sort((a, b) => a.weekNumber - b.weekNumber)
        };
    } catch (error) {
        console.error('Error loading training data:', error);
        return null;
    }
}

function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

window.formatDate = function(dateStr) {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
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
        if (weekDates.length === 0) continue;  // Skip empty weeks
        
        // Find Monday of the week (might be before first run)
        const firstRunDate = new Date(Math.min(...weekDates.map(d => d.getTime())));
        const monday = new Date(firstRunDate);
        while (monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }
        
        // Calculate Sunday from Monday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);  // End of Sunday
        
        // Check if current date falls within this week
        if (now >= monday && now <= sunday) {
            return i;
        }
    }
    
    // If no current week found, find the closest future week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        if (weekDates.length === 0) continue;
        const monday = new Date(Math.min(...weekDates.map(d => d.getTime())));
        while (monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }
        if (monday > now) {
            return i;
        }
    }
    
    return 0;
}

// Navigation functions
window.scrollToCurrentWeek = function() {
    const currentWeek = document.querySelector('.week.current-week');
    if (currentWeek) {
        currentWeek.scrollIntoView({ behavior: 'smooth' });
    }
}

window.scrollToPrevWeek = function() {
    const weeks = Array.from(document.querySelectorAll('.week'));
    const currentWeekIndex = weeks.findIndex(week => {
        const rect = week.getBoundingClientRect();
        return rect.top > -rect.height / 2;
    });
    
    if (currentWeekIndex > 0) {
        weeks[currentWeekIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

window.scrollToNextWeek = function() {
    const weeks = Array.from(document.querySelectorAll('.week'));
    const currentWeekIndex = weeks.findIndex(week => {
        const rect = week.getBoundingClientRect();
        return rect.top > -rect.height / 2;
    });
    
    if (currentWeekIndex < weeks.length - 1) {
        weeks[currentWeekIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}