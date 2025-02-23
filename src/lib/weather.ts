import { format } from 'date-fns';

// Make API key check non-blocking
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY

export interface WeatherForecast {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

export interface LocationWeather {
  city: string;
  country: string;
  forecasts: WeatherForecast[];
}

export async function getWeatherForecast(
  cityName: string,
  startDate: Date,
  endDate: Date
): Promise<LocationWeather> {
  try {
    console.log(`Getting weather forecast for ${cityName}...`);
    console.log('Date range:', { startDate, endDate });

    if (!WEATHER_API_KEY) {
      console.warn('No WeatherAPI key provided, returning mock data')
      return getMockWeather(cityName, startDate, endDate)
    }
    
    // Calculate the number of days between start and end date
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    // Get forecast data from WeatherAPI.com
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(cityName)}&days=${days}&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Failed to get weather: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Weather API response for ${cityName}:`, data);

    if (!data.forecast?.forecastday) {
      throw new Error(`Invalid weather data format for ${cityName}`);
    }

    const forecasts: WeatherForecast[] = data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      temp: {
        min: day.day.mintemp_c,
        max: day.day.maxtemp_c
      },
      description: day.day.condition.text,
      icon: day.day.condition.icon.replace('//cdn.weatherapi.com', 'https://cdn.weatherapi.com')
    }));

    const result = {
      city: data.location.name,
      country: data.location.country,
      forecasts: forecasts
    };

    console.log(`Processed weather data for ${cityName}:`, result);
    return result;
  } catch (error) {
    console.error(`Error getting weather forecast for ${cityName}:`, error);
    return getMockWeather(cityName, startDate, endDate);
  }
}

function getMockWeather(cityName: string, startDate: Date, endDate: Date): LocationWeather {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const forecasts: WeatherForecast[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    forecasts.push({
      date: format(date, 'yyyy-MM-dd'),
      temp: {
        min: 15,
        max: 25
      },
      description: 'Partly cloudy',
      icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
    });
  }

  return {
    city: cityName,
    country: 'Sample Country',
    forecasts
  };
}

function getMostFrequent(arr: string[]): string {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop() || arr[0];
} 