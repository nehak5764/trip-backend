// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// const OPENWEATHER_KEY =
//   process.env.OPENWEATHER_KEY || process.env.VITE_OPENWEATHER_KEY;

// // ✅ Accurate Weather via Geo + City Correction
// router.get("/", async (req, res) => {
//   const { lat, lon } = req.query;
//   if (!lat || !lon) return res.status(400).json({ error: "Latitude and longitude required" });

//   if (!OPENWEATHER_KEY)
//     return res.status(500).json({ error: "Missing OpenWeather API key" });

//   try {
//     // 1️⃣ Reverse-geocode first
//     const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
//     const geoRes = await axios.get(geoUrl, {
//       headers: { "User-Agent": "TripMate/1.0" },
//     });

//     const addr = geoRes.data.address;
//     let city =
//       addr.city ||
//       addr.town ||
//       addr.village ||
//       addr.suburb ||
//       addr.state_district ||
//       addr.state;

//     if (!city) city = "Delhi"; // fallback

//     // 🧹 Cleanup noisy suffixes
//     city = city.replace(/Municipal Corporation|District|Tehsil/gi, "").trim();

//     // 2️⃣ Query weather by city name instead of raw lat/lon
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
//       city
//     )}&appid=${OPENWEATHER_KEY}&units=metric`;

//     const weatherRes = await axios.get(weatherUrl);
//     const data = weatherRes.data;

//     const result = {
//       name: `${data.name}, ${data.sys.country}`,
//       temp: Math.round(data.main.temp),
//       description: data.weather[0].description,
//       icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
//     };

//     console.log(`🌤️ Accurate weather fetched for ${city}:`, result);
//     return res.json(result);
//   } catch (err) {
//     console.error("🔥 Weather fetch error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Failed to fetch accurate weather" });
//   }
// });

// // ✅ Quick weather by city name (unchanged)
// router.get("/quick", async (req, res) => {
//   const { location } = req.query;
//   if (!location) return res.status(400).json({ error: "Location required" });
//   if (!OPENWEATHER_KEY)
//     return res.status(500).json({ error: "Missing OpenWeather API key" });

//   try {
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
//       location
//     )}&appid=${OPENWEATHER_KEY}&units=metric`;
//     const response = await axios.get(url);
//     const data = response.data;

//     return res.json({
//       name: `${data.name}, ${data.sys.country}`,
//       temp: Math.round(data.main.temp),
//       description: data.weather[0].description,
//       icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
//     });
//   } catch (err) {
//     console.error("🔥 Weather API (city) error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Failed to fetch weather by city" });
//   }
// });

// module.exports = router;
// backend/routes/weather.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || process.env.VITE_OPENWEATHER_KEY;

// ✅ Route 1: Get weather by latitude/longitude (for current location)
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  if (!OPENWEATHER_KEY) {
    console.error("❌ Missing OpenWeather API key.");
    return res.status(500).json({ error: "Missing OpenWeather API key" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    return res.json({
      name: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      coord: data.coord,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    });
  } catch (err) {
    console.error("🔥 Weather API (lat/lon) error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch weather by location" });
  }
});

// ✅ Route 2: Get weather + coordinates by city name
router.get("/quick", async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location required" });
  }

  if (!OPENWEATHER_KEY) {
    return res.status(500).json({ error: "Missing OpenWeather API key" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${OPENWEATHER_KEY}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    // ✅ Include coordinates so the frontend can draw routes
    return res.json({
      name: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      coord: data.coord,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    });
  } catch (err) {
    console.error("🔥 Weather API (city) error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch weather by city" });
  }
});

module.exports = router;
