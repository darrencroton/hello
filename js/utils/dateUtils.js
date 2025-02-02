function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                   'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]} ${getOrdinal(date.getDate())} ${months[date.getMonth()]}`;
}

function getDateRange(dates) {
    const monday = new Date(Math.min(...dates.map(d => d.getTime())));
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                   'August', 'September', 'October', 'November', 'December'];
    
    if (monday.getMonth() === sunday.getMonth()) {
        return `${getOrdinal(monday.getDate())} - ${getOrdinal(sunday.getDate())} ${months[monday.getMonth()]}`;
    } else {
        return `${getOrdinal(monday.getDate())} ${months[monday.getMonth()]} - 
                ${getOrdinal(sunday.getDate())} ${months[sunday.getMonth()]}`;
    }
}

export { formatDate, getDateRange };