import React, { useEffect, useState } from "react";
import { Sun, Moon, Search, Clock, History } from "lucide-react";
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

  const fetchData = async (searchCity) => {
    if (!searchCity) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather?city=${searchCity}`
      );
      setWeatherData(res.data);

      const resdata = await axios.get(
        `http://localhost:5000/api/forecast?city=${searchCity}`
      );
      setForecastData(resdata.data);

      if (!searchHistory.includes(searchCity)) {
        const updatedHistory = [searchCity, ...searchHistory].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(city);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto transition-colors duration-300 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-[var(--text-color-a)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Weather Dashboard</h1>
        <button
          className="rounded-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-md"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="h-5 w-5 text-gray-800" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>

      <section className="pt-4 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
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
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-300">
              <History className="h-4 w-4" />
              <span>Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
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

      {error && city !== "" && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {weatherData && (
        <WeatherCard weatherData={weatherData} forecastData={forecastData} />
      )}
    </div>
  );
}

export default App;
