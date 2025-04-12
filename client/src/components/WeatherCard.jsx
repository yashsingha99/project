import React from "react";
import { Calendar, Droplets, Thermometer, Wind } from "lucide-react";

const WeatherCard = ({ weatherData, forecastData }) => {
  if (!weatherData) return null;

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return "Unknown date";
    }
  };

  const getWeatherIcon = (iconCode) =>
    iconCode
      ? `http://openweathermap.org/img/wn/${iconCode}@2x.png`
      : "";

  return (
    <div className="w-full space-y-6 ">
      {/* Main Weather Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-1">{weatherData.city || "Unknown Location"}</h2>
              <div className="flex items-center text-sm space-x-2 text-blue-100">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(Date.now())}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {Math.round(weatherData.temperature)} °C
              </div>
              <div className="text-sm text-blue-100">
                Feels like {Math.round(weatherData.feels_like)} °C
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {weatherData.icon && (
              <img
                src={getWeatherIcon(weatherData.icon)}
                alt={weatherData.description || "Weather icon"}
                className="w-16 h-16"
              />
            )}
            <div>
              <div className="text-lg font-medium capitalize">{weatherData.description}</div>
              <div className="text-sm text-muted-foreground">{weatherData.condition}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <Wind className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-muted-foreground">Wind</div>
                <div className="font-medium">{weatherData.wind} m/s</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="font-medium">{weatherData.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <div className="text-sm text-muted-foreground">Pressure</div>
                <div className="font-medium">N/A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Cards */}
      {forecastData && forecastData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecastData.slice(0, 5).map((day, index) => (
              <div key={index} className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-3 bg-gradient-to-br from-indigo-400 to-blue-500 text-white text-center">
                  <p className="font-medium">{formatDate(day.date)}</p>
                </div>
                <div className="p-4 flex flex-col items-center">
                  {day.icon && (
                    <img
                      src={getWeatherIcon(day.icon)}
                      alt={day.description}
                      className="w-12 h-12"
                    />
                  )}
                  <p className="text-lg font-bold mt-2">{Math.round(day.temperature)}°C</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;