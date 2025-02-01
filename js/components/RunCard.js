import { formatDate } from '../utils/dateUtils.js';
import { convertToKm } from '../utils/distanceUtils.js';

/**
 * Creates a card element for a run or rest day
 * @param {Object} day - Day data object
 * @param {boolean} useKm - Whether to display distances in kilometers
 * @returns {HTMLElement} Run card element
 */
export function createRunCard(day, useKm) {
    const cardEl = document.createElement('div');
    cardEl.className = 'run-card' + (day.type === 'Rest' ? ' rest-day' : '');
    
    const distance = day.distance ? 
        (useKm ? day.distance.toFixed(1) : convertToKm(day.distance)) : 0;

    cardEl.innerHTML = `
        <div class="run-date">${formatDate(day.date)}</div>
        <div class="run-type">${day.type}</div>
        ${distance > 0 ? `
            <div class="stat">
                <div class="stat-value">${distance}km</div>
                <div class="stat-label">Distance</div>
            </div>
        ` : ''}
        ${day.notes ? `<div class="run-notes">${day.notes}</div>` : ''}
    `;
    
    return cardEl;
}

/**
 * Creates a divider element between run cards
 * @returns {HTMLElement} Divider element
 */
export function createDivider() {
    const divider = document.createElement('div');
    divider.className = 'week-divider';
    return divider;
}