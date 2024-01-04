import React, { useEffect, useState } from "react";
import axios from "axios";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import "./App.css";

const weatherDescriptions = {
  "clear-day": "01d",
  "partly-cloudy-day": "02d",
  "scattered clouds": "03d",
  "broken clouds": "04d",
  "shower rain": "09d",
  rain: "10d",
  thunderstorm: "11d",
  snow: "13d",
  mist: "50d",
};
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const App = () => {
  const { state, dispatch } = useWeather();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${state.city}/next7days?unitGroup=metric&include=days&key=A7DJ2VZ86L5JYYLXU3KCFP97J&contentType=json`
        );
        console.log(response);

        dispatch({ type: "SET_WEATHER_DATA", payload: response.data });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [state.city, dispatch]);

  const handleCityChange = (e) => {
    dispatch({ type: "SET_CITY", payload: e.target.value });
  };

  return (
    <div className="App">
      <header>
        <h1>Weather App</h1>
      </header>
      <div className="selection-container">
        <label htmlFor="citySelect">Location:</label>
        <select id="citySelect" onChange={handleCityChange} value={state.city}>
          <option value="Istanbul">Istanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="Bursa">Bursa</option>
          <option value="Izmir">Izmir</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="content">
          <h2>Weekly Forecast in {state.city} </h2>
          <div className="card-container">
            {state.weatherData.days.slice(0, -1).map((dailyData) => (
              <div key={dailyData.datetime} className="weather-card">
                <p className="date-day">
                  {dayNames[new Date(dailyData.datetime).getDay()]}
                </p>
                <p className="date">{dailyData.datetime}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${
                    weatherDescriptions[dailyData.icon]
                  }@2x.png`}
                  alt={dailyData.description}
                />
                <p>
                  <span className="min-max">Max:</span>{" "}
                  {Math.round(dailyData.tempmax)}°C
                </p>
                <p>
                  <span className="min-max">Min:</span>{" "}
                  {Math.round(dailyData.tempmin)}°C
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const WrappedApp = () => (
  <WeatherProvider>
    <App />
  </WeatherProvider>
);

export default WrappedApp;
