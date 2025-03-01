import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public humidity: number,
    public windSpeed: number
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(baseURL: string, apiKey: string, cityName: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    let locationData: Coordinates = {
      lat:0,
      lon:0,
      };
      const geoQuery = this.buildGeocodeQuery(query) 
      const geocode = await fetch(geoQuery);
      
      if (!geocode.ok) {
      throw new Error(`Error: ${geocode.statusText}`);
      }
      
      const geocodeParsed = await geocode.json();
      locationData = {
        lat: geocodeParsed[0].lat,
        lon: geocodeParsed[0].lon
      };
      
      return locationData;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    let coordinates = { 
    lat,
    lon
  }; 
  return coordinates;
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }
  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }
  
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const weatherData = await response.json();
    return this.parseCurrentWeather(weatherData);
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { list } = response;
    const { main, weather, wind } = list[0];
    return new Weather(
      main.temp,
      weather[0].description,
      main.humidity,
      wind.speed
    );
  }
  public async getWeather(): Promise<void> {
    const coordinates = await this.fetchAndDestructureLocationData();
    const weather = await this.fetchWeatherData(coordinates);
    console.log(`Weather for ${this.cityName}:`, weather);
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService('https://api.openweathermap.org', process.env.API_KEY!, 'London');