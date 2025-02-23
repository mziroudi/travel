import { format } from 'date-fns';

if (!process.env.NEXT_PUBLIC_WEATHERAPI_KEY) {
  throw new Error('Missing NEXT_PUBLIC_WEATHERAPI_KEY environment variable');
}

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
    
    // Calculate the number of days between start and end date
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    // Get forecast data from WeatherAPI.com
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHERAPI_KEY}&q=${encodeURIComponent(cityName)}&days=${days}&aqi=no`
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
    throw error;
  }
}

function getMostFrequent(arr: string[]): string {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop() || arr[0];
} 