import { MILES_TO_KM, KM_TO_MILES } from './constants.js';

export function convertToKm(miles) {
    return (miles * MILES_TO_KM).toFixed(1);
}

export function convertToMiles(km) {
    return (km * KM_TO_MILES).toFixed(1);
}

export function formatDistance(distance, useKm) {
    return useKm ? distance.toFixed(1) : convertToKm(distance);
}