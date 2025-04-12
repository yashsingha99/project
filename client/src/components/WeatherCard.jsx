import React, { useEffect, useState } from "react";

function WeatherCard({ weatherData, forecastData }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--boxes-color)] p-6 rounded-2xl shadow-lg text-[var(--text-color-a)] transition-all duration-300">
      <div>
        <section>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">
                  {weatherData.city}, {weatherData.country}
                </h2>
                <p className="text-sm opacity-80">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt={weatherData.description}
                className="h-16 w-16"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-5xl font-bold">
                  {Math.round(weatherData.temperature)}°C
                </div>
                <div className="text-sm opacity-80">
                  Feels like: {Math.round(weatherData.feels_like)}°C
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">
                  {weatherData.condition}
                </div>
                <div className="text-sm capitalize opacity-70">
                  {weatherData.description}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="text-center">
                <div className="text-sm opacity-70">Humidity</div>
                <div className="font-medium">{weatherData.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm opacity-70">Wind Speed</div>
                <div className="font-medium">{weatherData.wind} m/s</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div>
        <section>
          <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {forecastData.map((day, index) => (
              <div
                key={index}
                className="rounded-xl p-4 text-center bg-[var(--header-bg-color)] text-[var(--text-color-a)] shadow"
              >
                <div className="font-medium">{formatDate(day.date)}</div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="h-12 w-12 mx-auto my-2"
                />
                <div className="font-bold text-lg">
                  {Math.round(day.temperature)}°C
                </div>
                <div className="text-xs opacity-80">{day.condition}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default WeatherCard;
