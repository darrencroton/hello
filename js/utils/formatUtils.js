function padZero(num) {
    return num.toString().padStart(2, '0');
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function convertToKm(miles) {
    return (miles * 1.60934).toFixed(1);
}

export { padZero, formatTime, convertToKm };