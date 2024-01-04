// WeatherContext.js

import { createContext, useContext, useReducer } from "react";

const WeatherContext = createContext();

const initialState = {
  city: "Istanbul", // Varsayılan şehir
  weatherData: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_WEATHER_DATA":
      return { ...state, weatherData: action.payload };
    default:
      return state;
  }
};

const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

export { WeatherProvider, useWeather };
