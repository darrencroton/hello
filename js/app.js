import { findCurrentWeekIndex } from './dateUtils.js';
import { fetchTrainingData } from './utils.js';
import { createWeekElement } from './elements.js';

class TrainingApp {
    constructor() {
        this.currentWeekIndex = 0;
        this.totalWeeks = 0;
        this.headerHeight = 0;
        this.useKm = true;
        this.weekContainer = null;
    }

    scrollToWeek(weekIndex) {
        const weekWidth = window.innerWidth;
        this.weekContainer.scrollTo({
            left: weekIndex * weekWidth,
            behavior: 'smooth'
        });
        this.currentWeekIndex = weekIndex;
    }

    setupNavigation() {
        document.getElementById('prevWeek').addEventListener('click', () => {
            if (this.currentWeekIndex > 0) {
                this.scrollToWeek(this.currentWeekIndex - 1);
            }
        });

        document.getElementById('todayWeek').addEventListener('click', () => {
            this.scrollToWeek(this.currentWeekIndex);
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            if (this.currentWeekIndex < this.totalWeeks - 1) {
                this.scrollToWeek(this.currentWeekIndex + 1);
            }
        });
    }

    async initialize() {
        const data = await fetchTrainingData();
        if (!data) {
            document.getElementById('app').innerHTML = '<div class="loading">Error loading training data</div>';
            return;
        }

        // Update page title with race name
        document.querySelector('.header h1').textContent = data.racename;

        // Cache important values
        this.useKm = data.units === 'kilometers';
        this.totalWeeks = data.weeks.length;
        this.headerHeight = document.querySelector('.header').offsetHeight;
        
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.id = 'main-container';
        
        // Create navigation buttons
        const navContainer = document.createElement('div');
        navContainer.className = 'nav-container';
        navContainer.innerHTML = `
            <button id="prevWeek" class="nav-button">Previous</button>
            <button id="todayWeek" class="nav-button">Today</button>
            <button id="nextWeek" class="nav-button">Next</button>
        `;
        mainContainer.appendChild(navContainer);
        
        // Create and cache week container
        this.weekContainer = document.createElement('div');
        this.weekContainer.className = 'week-container';
        mainContainer.appendChild(this.weekContainer);

        data.weeks.forEach((week) => {
            this.weekContainer.appendChild(
                createWeekElement(week, week.weekNumber, this.totalWeeks, this.useKm, this.headerHeight)
            );
        });

        // Replace loading message with main content
        const appElement = document.getElementById('app');
        appElement.innerHTML = '';
        appElement.appendChild(mainContainer);

        // Setup navigation and scroll to current week
        this.setupNavigation();
        this.currentWeekIndex = findCurrentWeekIndex(data.weeks);
        this.scrollToWeek(this.currentWeekIndex);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new TrainingApp();
    app.initialize();
});