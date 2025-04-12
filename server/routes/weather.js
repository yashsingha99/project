const router = require("express").Router();

const axios = require("axios");
const API_KEY = process.env.API_KEY;
// Weather route
router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const weatherData = {
      city: weatherResponse.data.name,
      country: weatherResponse.data.sys.country,
      temperature: weatherResponse.data.main.temp,
      feels_like: weatherResponse.data.main.feels_like,
      humidity: weatherResponse.data.main.humidity,
      wind: weatherResponse.data.wind.speed,
      condition: weatherResponse.data.weather[0].main,
      description: weatherResponse.data.weather[0].description,
      icon: weatherResponse.data.weather[0].icon,
    };
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch weather data",
    });
  }
});

// Forecast route
router.get("/forecast", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastList = forecastResponse.data.list;

    const dailyForecasts = [];
    const days = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();

      if (!days[date]) {
        days[date] = true;
        dailyForecasts.push({
          date: item.dt * 1000,
          temperature: item.main.temp,
          feels_like: item.main.feels_like,
          humidity: item.main.humidity,
          wind: item.wind.speed,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
    });

    // Limit to 5 days
    res.json(dailyForecasts.slice(0, 5));
  } catch (error) {
    console.error("Error fetching forecast data:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch forecast data",
    });
  }
});

// City autocomplete route
router.get("/cities", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const API_KEY = process.env.GEODB_API_KEY;
    const citiesResponse = await axios.get(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );

    const cities = citiesResponse.data.data.map((city) => ({
      name: city.name,
      country: city.countryCode,
      fullName: `${city.name}, ${city.countryCode}`,
    }));

    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities data:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch cities data",
    });
  }
});

module.exports = router;
