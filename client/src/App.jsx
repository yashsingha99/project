import React, { useEffect, useState } from "react";
import { Sun, Moon, Search, Clock, History, CloudRain } from "lucide-react";
import WeatherCard from "./components/WeatherCard";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [theme, setTheme] = useState("light");
  const URL = import.meta.env.VITE_SERVER;
  const fetchData = async (searchCity) => {
    if (!searchCity) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${URL}/api/weather?city=${searchCity}`);

      if (res.data) {
        setWeatherData(res.data);
      } else {
        throw new Error("No weather data received");
      }

      const resdata = await axios.get(`${URL}/api/forecast?city=${searchCity}`);

      if (resdata.data) {
        setForecastData(resdata.data);
      } else {
        setForecastData([]);
      }

      if (!searchHistory.includes(searchCity)) {
        const updatedHistory = [searchCity, ...searchHistory].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch weather data.");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchData(city);
      setCity("");
    }
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    // Apply saved theme
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Load search history
    try {
      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      setSearchHistory(history);

      // Auto-load last searched city if available
      if (history.length > 0) {
        setCity(history[0]);
        fetchData(history[0]);
      }
    } catch (e) {
      console.error("Error loading search history:", e);
      localStorage.removeItem("searchHistory");
    }
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:py-8 max-w-4xl mx-auto transition-colors duration-300  border-1 rounded-2xl p-4 m-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center">
          <CloudRain className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-300">
            Weather Dashboard
          </h1>
        </div>
        <button
          className="rounded-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-yellow-400" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </button>
      </div>

      <section className="pt-2 md:pt-4 mb-6 md:mb-8  ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className="flex items-center justify-center px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" /> Loading
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Search
              </>
            )}
          </button>
        </form>

        {searchHistory.length > 0 && (
          <div className="mt-4 md:mt-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-300">
              <History className="h-4 w-4" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setCity(item);
                    fetchData(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800 flex items-start">
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Clock className="h-12 w-12 animate-spin mb-4" />
          <p className="text-lg">Loading weather data...</p>
        </div>
      ) : weatherData ? (
        <WeatherCard weatherData={weatherData} forecastData={forecastData} />
      ) : (
        !error && (
          <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <CloudRain className="h-16 w-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search for a city to see the weather
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Enter a city name above to get current weather and forecast
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default App;
