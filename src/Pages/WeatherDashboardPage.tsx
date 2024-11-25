import React, { useEffect, useState, useCallback } from "react";
import ColumnDashboard from "../Components/ColumnDashboard";
import LineDashboard from "../Components/LineDashboard";
import AreaChartDashboard from "../Components/AreaChartDashboard";

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly: {
    time: string[];
    relativehumidity_2m: number[];
    direct_radiation: number[];
  };
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

const STORE_NAME = "weatherStore";
const DB_NAME = "WeatherDB";

const WeatherDashboardPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initDB = useCallback(async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, []);

  const saveData = useCallback(
    async (data: WeatherData) => {
      const db = await initDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: "weatherData", ...data });

        request.onsuccess = () => console.log("Data saved successfully");
        request.onerror = () => reject(request.error);

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    },
    [initDB]
  );

  const getData = useCallback(async (): Promise<WeatherData | null> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("weatherData");

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }, [initDB]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      const API =
        "https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2024-11-01&end_date=2024-11-10";

      try {
        const cachedData = await getData();
        if (cachedData) {
          console.log("Using cached data");
          setWeatherData(cachedData);
        } else {
          console.log("Fetching new data");
          const response = await fetch(API);
          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const data: WeatherData = await response.json();
          setWeatherData(data);
          await saveData(data);
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [getData, saveData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Weather Dashboard</h1>
      <ColumnDashboard
        y_axis_label="Relative Humidity (%)"
        time={weatherData.hourly.time}
        values={weatherData.hourly.relativehumidity_2m}
      />
      <LineDashboard
        time={weatherData.daily.time}
        minTemperature={weatherData.daily.temperature_2m_min}
        maxTemperature={weatherData.daily.temperature_2m_max}
      />
      <AreaChartDashboard
        y_axis_label="Direct Radiation (W/m²)"
        time={weatherData.hourly.time}
        values={weatherData.hourly.direct_radiation}
      />
    </div>
  );
};

export default WeatherDashboardPage;
