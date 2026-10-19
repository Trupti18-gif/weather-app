const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

const weatherText = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm"
};

async function getWeather(city) {
  result.innerHTML = "Loading...";

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      result.innerHTML = `<p class="error">City not found. Check the spelling.</p>`;
      return;
    }

    const { name, country, latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    result.innerHTML = `
      <h2>${name}, ${country}</h2>
      <div class="temp">${current.temperature_2m}°C</div>
      <p>${weatherText[current.weather_code] || "Weather data"}</p>
      <p>Wind: ${current.wind_speed_10m} km/h</p>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">Something went wrong. Check your internet and try again.</p>`;
  }
}

function search() {
  const city = cityInput.value.trim();
  if (city === "") {
    result.innerHTML = `<p class="error">Please enter a city name.</p>`;
    return;
  }
  getWeather(city);
}

searchBtn.addEventListener("click", search);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});