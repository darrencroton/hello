// Configuration
const config = {
    dataDir: 'data/',
    weeks: [],  // Will be populated with available week numbers
};

// Load and parse a week file
async function loadWeekFile(weekNum) {
    const response = await fetch(`${config.dataDir}week${weekNum}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { weekNum, ...data };
}

// Get sorted list of available week numbers
function getAllWeekNumbers() {
    return config.weeks.sort((a, b) => a - b);
}

// Get current week number
function getCurrentWeek() {
    return Math.max(...getAllWeekNumbers());
}

// Load all week files
async function loadAllWeekData() {
    const weekNumbers = getAllWeekNumbers();
    const weekData = await Promise.all(
        weekNumbers.map(week => loadWeekFile(week))
    );
    return weekData.sort((a, b) => a.weekNum - b.weekNum);
}

// Initialize data with a callback for updates
async function initializeData(onDataUpdate) {
    // Phase 1: Load and display current week
    const currentWeek = getCurrentWeek();
    const weekData = await loadWeekFile(currentWeek);
    onDataUpdate([weekData]);
    
    // Phase 2: Load all weeks in background
    const allData = await loadAllWeekData();
    onDataUpdate(allData);
}

// Set available weeks
function setAvailableWeeks(weeks) {
    config.weeks = weeks;
}

export { initializeData, setAvailableWeeks };