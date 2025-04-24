import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('weatherLocation');
    return saved || 'New Delhi';
  });
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Get API key from environment variables
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeatherData = async (loc) => {
    try {
      setLoading(true);
      setError(null);
      
      // Using the free tier endpoint instead of OneCall API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data not available: ${response.status}`);
      }
      
      const data = await response.json();
      
      setWeatherData({
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
      });
      
      // Save location to localStorage
      localStorage.setItem('weatherLocation', data.name);
      setLocation(data.name);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Could not fetch weather data. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Use geolocation to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Using the free tier endpoint with coordinates
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            
            if (!response.ok) {
              throw new Error(`Weather data not available: ${response.status}`);
            }
            
            const data = await response.json();
            
            setWeatherData({
              location: data.name,
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].main,
              feelsLike: Math.round(data.main.feels_like),
              humidity: data.main.humidity,
              windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
            });
            
            // Save location to localStorage
            localStorage.setItem('weatherLocation', data.name);
            setLocation(data.name);
            
          } catch (err) {
            console.error('Error fetching weather data:', err);
            setError(`Could not fetch weather data. Error: ${err.message}`);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Could not access your location. Please search manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    
    fetchWeatherData(searchLocation);
    setSearchLocation('');
    setIsSearchVisible(false);
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return '🌤️';
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('drizzle')) return '🌦️';
    
    return '🌤️';
  };

  // Toggle search form
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2 className="weather-title">Weather</h2>
        <div className="weather-controls">
          <button className="location-btn" onClick={getCurrentLocation} title="Use current location">
            📍
          </button>
          <button className="search-btn" onClick={toggleSearch} title="Search location">
            🔍
          </button>
        </div>
      </div>
      
      {isSearchVisible && (
        <form className="weather-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="weather-search-input"
            placeholder="Enter city name..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            required
          />
          <button type="submit" className="weather-search-btn">Search</button>
        </form>
      )}
      
      {loading ? (
        <div className="weather-loading">Loading weather data...</div>
      ) : error ? (
        <div className="weather-error">{error}</div>
      ) : weatherData ? (
        <>
          <div className="weather-location">{weatherData.location}</div>
          <div className="weather-main">
            <div className="weather-icon">{getWeatherIcon(weatherData.condition)}</div>
            <div className="weather-info">
              <div className="weather-temp">{weatherData.temperature}°C</div>
              <div className="weather-desc">{weatherData.condition}</div>
            </div>
          </div>
          
          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-label">Feels Like</span>
              <span className="detail-value">{weatherData.feelsLike}°C</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weatherData.humidity}%</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Wind</span>
              <span className="detail-value">{weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </>
      ) : (
        <div className="weather-error">Weather data unavailable</div>
      )}
    </div>
  );
};

export default Weather; 