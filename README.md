# NoirBoard - Productivity Dashboard for Chrome

NoirBoard is a sleek productivity dashboard that replaces your new tab page in Chrome. It helps you organize tasks, track expenses, set goals, and stay updated with weather information.

![NoirBoard Screenshot](public/icons/icon128.png)

## Features

- **Live Clock**: Real-time 12-hour format clock
- **Weather Widget**: Current weather conditions with location search
- **Todo List**: Manage your daily tasks
- **Goal Setter**: Track goals with deadlines
- **Expense Tracker**: Budget and expense management
- **Daily Routine**: Schedule recurring tasks
- **Future Events**: Track upcoming events

## Installation

### As a Chrome Extension

1. Clone and build the project:

   ```
   git clone https://github.com/harshify/noirboard.git
   cd noirboard
   npm install
   npm run build
   ```

2. Install in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder
   - Open a new tab to see NoirBoard

### As a Web App

1. Clone the repository:

   ```
   git clone https://github.com/harshify/noirboard.git
   cd noirboard
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Technical Details

- Built with React 19 and Vite
- Uses Chrome Storage API in extension mode and localStorage in web mode
- Custom styling with no external UI frameworks
- Weather data from OpenWeatherMap API

## Data Storage

- In extension mode: Chrome's `storage.sync` API (syncs across devices)
- In web mode: Browser's localStorage
- The app automatically detects which mode it's running in

## Development

```
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
/public          - Static assets and extension manifest
/src
  /assets        - Images and other assets
  /components    - React components for each widget
  /utils         - Utility functions
  App.jsx        - Main application component
  main.jsx       - Application entry point
```

## Weather Widget Setup

To use the weather widget, you need an OpenWeatherMap API key:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory
3. Add your API key: `VITE_OPENWEATHER_API_KEY=your_api_key_here`

## License

MIT

## Author

[harshify](https://github.com/harshify)
