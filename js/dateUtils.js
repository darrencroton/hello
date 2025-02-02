const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getMondayOfWeek(date) {
    const monday = new Date(date);
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }
    return monday;
}

function getSundayOfWeek(monday) {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${DAYS[date.getDay()]} ${getOrdinal(date.getDate())} ${MONTHS[date.getMonth()]}`;
}

function getDateRange(week) {
    const dates = week.runs.map(run => new Date(run.date));
    const monday = getMondayOfWeek(Math.min(...dates.map(d => d.getTime())));
    const sunday = getSundayOfWeek(monday);
    
    if (monday.getMonth() === sunday.getMonth()) {
        return `${getOrdinal(monday.getDate())} - ${getOrdinal(sunday.getDate())} ${MONTHS[monday.getMonth()]}`;
    } else {
        return `${getOrdinal(monday.getDate())} ${MONTHS[monday.getMonth()]} - ${getOrdinal(sunday.getDate())} ${MONTHS[sunday.getMonth()]}`;
    }
}

function findCurrentWeekIndex(weeks) {
    const now = new Date();
    
    // First try to find the current week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        if (weekDates.length === 0) continue;
        
        const monday = getMondayOfWeek(Math.min(...weekDates.map(d => d.getTime())));
        const sunday = getSundayOfWeek(monday);
        sunday.setHours(23, 59, 59, 999);
        
        if (now >= monday && now <= sunday) {
            return i;
        }
    }
    
    // If no current week found, find the closest future week
    for (let i = 0; i < weeks.length; i++) {
        const weekDates = weeks[i].runs.map(run => new Date(run.date));
        if (weekDates.length === 0) continue;
        
        const monday = getMondayOfWeek(Math.min(...weekDates.map(d => d.getTime())));
        if (monday > now) {
            return i;
        }
    }
    
    return 0;
}

export {
    formatDate,
    getDateRange,
    getMondayOfWeek,
    getSundayOfWeek,
    findCurrentWeekIndex
};