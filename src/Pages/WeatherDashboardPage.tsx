import React, { useEffect, useState } from 'react';
import { saveData, getData } from '../db';
import ColumnDashboard from '../Components/ColumnDashboard';
import LineDashboard from '../Components/LineDashboard';
import AreaChartDashboard from '../Components/AreaChartDashboard';

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

const WeatherDashboardPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      const API = "https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2024-11-01&end_date=2024-11-10";


      try {
        // Replace with your actual API endpoint
        const response = await fetch(API);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data: WeatherData = await response.json();
        setWeatherData(data);
        console.log(weatherData?.daily)
      } catch (err) {
        setError((err as Error).message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

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
      <ColumnDashboard y_axis_label='Relative Humidity (%)' time={weatherData.hourly.time} values={weatherData.hourly.relativehumidity_2m} />
      <LineDashboard time={weatherData.daily.time} minTemperature={ weatherData.daily.temperature_2m_min} maxTemperature={weatherData.daily.temperature_2m_max}/> 
      <AreaChartDashboard y_axis_label='Direct Radiation (W/m²)' time={ weatherData.hourly.time} values={weatherData.hourly.direct_radiation}/>
    </div>
  );
};

export default WeatherDashboardPage;
