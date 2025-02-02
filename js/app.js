import { findCurrentWeekIndex } from './dateUtils.js';
import { fetchTrainingData } from './utils.js';
import { createWeekElement } from './elements.js';
import { CLASSES, IDS } from './constants.js';

class TrainingApp {
    constructor() {
        this.currentWeekIndex = 0;
        this.todayWeekIndex = 0;
        this.totalWeeks = 0;
        this.headerHeight = 0;
        this.useKm = true;
        this.weekContainer = null;
        
        // Cache DOM elements that we'll use repeatedly
        this.appElement = document.getElementById(IDS.APP);
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
        document.getElementById(IDS.PREV_WEEK).addEventListener('click', () => {
            if (this.currentWeekIndex > 0) {
                this.scrollToWeek(this.currentWeekIndex - 1);
            }
        });

        document.getElementById(IDS.TODAY_WEEK).addEventListener('click', () => {
            this.scrollToWeek(this.todayWeekIndex);
        });

        document.getElementById(IDS.NEXT_WEEK).addEventListener('click', () => {
            if (this.currentWeekIndex < this.totalWeeks - 1) {
                this.scrollToWeek(this.currentWeekIndex + 1);
            }
        });
    }

    async initialize() {
        const data = await fetchTrainingData();
        if (!data) {
            this.appElement.innerHTML = `<div class="${CLASSES.LOADING}">Error loading training data</div>`;
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
        mainContainer.id = IDS.MAIN_CONTAINER;
        
        // Create navigation buttons
        const navContainer = document.createElement('div');
        navContainer.className = CLASSES.NAV_CONTAINER;
        navContainer.innerHTML = `
            <button id="${IDS.PREV_WEEK}" class="${CLASSES.NAV_BUTTON}">Previous</button>
            <button id="${IDS.TODAY_WEEK}" class="${CLASSES.NAV_BUTTON}">Today</button>
            <button id="${IDS.NEXT_WEEK}" class="${CLASSES.NAV_BUTTON}">Next</button>
        `;
        mainContainer.appendChild(navContainer);
        
        // Create and cache week container
        this.weekContainer = document.createElement('div');
        this.weekContainer.className = CLASSES.WEEK_CONTAINER;
        mainContainer.appendChild(this.weekContainer);

        data.weeks.forEach((week) => {
            this.weekContainer.appendChild(
                createWeekElement(week, week.weekNumber, this.totalWeeks, this.useKm, this.headerHeight)
            );
        });

        // Replace loading message with main content
        this.appElement.innerHTML = '';
        this.appElement.appendChild(mainContainer);

        // Setup navigation and scroll to current week
        this.setupNavigation();
        this.todayWeekIndex = findCurrentWeekIndex(data.weeks);
        this.currentWeekIndex = this.todayWeekIndex;
        this.scrollToWeek(this.currentWeekIndex);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new TrainingApp();
    app.initialize();
});