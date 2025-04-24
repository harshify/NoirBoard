# NoirBoard - A Modern Productivity Dashboard

NoirBoard is a feature-rich productivity dashboard that helps you organize your daily tasks, track goals, monitor expenses, and stay updated with weather information. It's designed with a sleek, modern UI and can be used as a browser extension to replace your new tab page.

## Features

- **Live Clock**: Shows current time in 12-hour format (hours, minutes, seconds)
- **Weather Widget**: Real-time weather information for any location
- **Todo List**: Manage your daily tasks with add, complete, and delete functionality
- **Goal Setter**: Set and track goals with deadlines, keeping your main goal visible at all times
- **Expense Tracker**: Track your expenses with category-based organization and budget management
- **Daily Routine**: Organize recurring tasks in your daily schedule
- **Future Events**: Keep track of upcoming important dates and events

## Tech Stack

- React (v19)
- Vite
- CSS (custom styling, no frameworks)
- LocalStorage for persistent data
- OpenWeatherMap API for weather data

## Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
   - To get an API key, sign up at [OpenWeatherMap](https://openweathermap.org/api)
4. Start the development server:
   ```
   npm run dev
   ```
5. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `/src/components/` - Contains all the React components
  - `/Clock/` - Clock component that displays time in 12-hour format
  - `/TodoList/` - Todo list component for task management
  - `/GoalSetter/` - Goal tracking with deadline functionality
  - `/ExpenseTracker/` - Track expenses with categories
  - `/Weather/` - Display weather information for your location
  - `/DailyRoutine/` - Manage recurring daily tasks
  - `/FutureEvents/` - Track upcoming events and dates

## Data Storage

All user data (todos, goals, expenses, routines, events) is stored in the browser's localStorage for persistence.

## Browser Extension Setup

NoirBoard can be set up as a browser extension to replace your new tab page:

### Chrome Extension
1. Build the project: `npm run build`
2. Create a `manifest.json` file in the `dist` folder:
```json
{
  "manifest_version": 3,
  "name": "NoirBoard",
  "version": "1.0.0",
  "description": "A productivity dashboard for your new tab page",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": [
    "storage"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```
3. Create an `/icons` folder in the `dist` directory with icon images
4. Load the extension in Chrome via Developer mode

### Firefox Extension
1. Build the project: `npm run build`
2. Create a `manifest.json` file in the `dist` folder:
```json
{
  "manifest_version": 2,
  "name": "NoirBoard",
  "version": "1.0.0",
  "description": "A productivity dashboard for your new tab page",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": [
    "storage"
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "noirboard@yourdomain.com",
      "strict_min_version": "57.0"
    }
  }
}
```
3. Create an `/icons` folder in the `dist` directory with icon images
4. Load the extension in Firefox as a temporary add-on

## Future Enhancements

- User authentication and profiles
- Cloud sync for user data across devices
- Dark/light theme toggle
- Custom widget arrangement
- Mobile-responsive design for all device sizes

## Weather Widget

The weather widget requires an OpenWeatherMap API key. To obtain one:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Copy your API key and add it to the `.env` file:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

The weather widget provides:
- Current temperature and conditions
- "Feels like" temperature
- Humidity and wind speed information
- Search functionality for different locations
- Option to use your current geolocation
