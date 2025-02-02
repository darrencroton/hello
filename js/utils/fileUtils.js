async function getWeekFiles() {
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

async function fetchTrainingData() {
    try {
        // Get metadata first
        const metaResponse = await fetch('data/metadata.json');
        const metadata = await metaResponse.json();
        
        // Get all week files
        const weeks = await getWeekFiles();
        
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

export { getWeekFiles, fetchTrainingData };