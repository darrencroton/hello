# Marathon Training Tracker

A web-based training plan tracker for marathon preparation, designed to help runners visualize their training schedule, track progress, and stay on target for race day.

## Overview

This application provides a comprehensive view of a marathon training plan, breaking it down week by week and day by day. It's built with vanilla JavaScript, HTML, and CSS, making it lightweight and portable.

## Features

- **Week-by-Week Training Plan**: Organized view of your entire training schedule
- **Daily Workout Details**: Each day shows workout type, distance, and specific notes
- **Progress Tracking**: Displays countdown to race day and weekly distance totals
- **Workout Reflection**: Track actual vs planned distances and add notes about completed runs
- **Performance Analysis**: Compare planned and completed weekly totals to track training progress
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to your system preferences

## Training Structure

This particular implementation follows a 12-week marathon training plan structured in four phases:

1. **Base Phase** (Weeks 1-3): Building aerobic base and establishing routine
2. **Strength Phase** (Weeks 4-6): Developing strength through hills and increasing endurance
3. **Peak Phase** (Weeks 7-9): Maximum endurance development and race pace confidence
4. **Taper Phase** (Weeks 10-12): Gradually reducing volume while maintaining fitness

## Workout Types

The plan includes several types of runs:

- **Easy Runs**: Recovery and base-building at comfortable pace
- **Long Runs**: Extended distance to build endurance (weekly cornerstone)
- **Medium-Long Runs**: Moderate distance often with hills for strength building
- **Quality Sessions**: Including tempo runs, hill repeats, and marathon pace segments
- **Rest Days**: Strategic recovery days

## Project Structure

```
├── css/
│   ├── run-card.css    # Styling for individual workout cards
│   ├── styles.css      # Main application styles
│   ├── variables.css   # CSS variables for theming
│   └── week.css        # Styling for weekly view
├── data/
│   ├── metadata.json   # Race information
│   └── week_*.json     # Training data by week
├── js/
│   ├── app.js          # Main application logic
│   ├── constants.js    # Application constants
│   ├── dateUtils.js    # Date manipulation utilities
│   ├── elements.js     # UI element creation
│   ├── units.js        # Distance unit conversion
│   └── utils.js        # General utilities
└── index.html          # Main HTML entry point
```

## Usage

Simply open `index.html` in a web browser. No server required.

## Customization

This template can be adapted for different training plans by modifying the JSON files in the `data` directory:

- Edit `metadata.json` to set your race details
- Create or modify `week_xxx.json` files to adjust training schedule
- Add actual workout data with fields like `actualDistance` and `actual` for completed runs

Example JSON format:
```json
{
  "date": "2025-03-04",
  "type": "Easy Run",
  "distance": 9,           // planned distance
  "planned": "Easy Run...", // planned workout description (or "notes" for backward compatibility)
  "actualDistance": 8.5,    // actual distance completed (optional)
  "actual": "Felt tired..."  // notes about the completed workout (optional)
}
```

## Target Audience

This project is ideal for:
- Marathon runners following a structured training plan
- Coaches who want to provide digital training plans to athletes
- Running clubs organizing group marathon training

## License

MIT