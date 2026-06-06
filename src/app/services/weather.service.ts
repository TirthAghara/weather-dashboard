import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError, of } from 'rxjs';
import { CurrentWeather, Forecast16Response } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;
  private apiUrl = environment.apiUrl;

  // Mock data so the dashboard works without a real API key
  private mockCurrent: CurrentWeather = {
    coord: { lon: -0.1257, lat: 51.5085 },
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    base: "stations",
    main: { temp: 22.5, feels_like: 21.8, temp_min: 20.0, temp_max: 24.1, pressure: 1015, humidity: 45 },
    visibility: 10000,
    wind: { speed: 4.1, deg: 80 },
    clouds: { all: 0 },
    dt: 1625050000,
    sys: { type: 1, id: 1414, country: "GB", sunrise: 1625026000, sunset: 1625085000 },
    timezone: 3600, id: 2643743, name: "London (Mock Data)", cod: 200
  };

  private mockForecast16: Forecast16Response = {
    cod: "200", message: 0, cnt: 7,
    city: { id: 2643743, name: "London", coord: { lat: 51.5085, lon: -0.1257 }, country: "GB" },
    list: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        dt: Math.floor(date.getTime() / 1000),
        temp: {
          day: 20 + Math.random()*5,
          min: 15 + Math.random()*3,
          max: 22 + Math.random()*5,
          night: 16, eve: 19, morn: 17
        },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        pressure: 1015,
        humidity: 50,
        speed: 3
      };
    })
  };

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<CurrentWeather> {
    if (this.apiKey.includes('openweathermap.org') || this.apiKey === 'b6907d289e10d714a6e88b30761fae22') {
      return of({...this.mockCurrent, name: `${city} (Mock Data)`});
    }
    return this.http.get<CurrentWeather>(`${this.apiUrl}/weather?q=${city}&units=metric&appid=${this.apiKey}`)
      .pipe(catchError((err) => {
        if (err.status === 401) return of({...this.mockCurrent, name: `${city} (Mock Data)`});
        return this.handleError(err);
      }));
  }

  getCurrentWeatherByCoords(lat: number, lon: number): Observable<CurrentWeather> {
    if (this.apiKey.includes('openweathermap.org') || this.apiKey === 'b6907d289e10d714a6e88b30761fae22') {
      return of({...this.mockCurrent, name: `Your Location (Mock Data)`});
    }
    return this.http.get<CurrentWeather>(`${this.apiUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .pipe(catchError((err) => {
        if (err.status === 401) return of({...this.mockCurrent, name: `Your Location (Mock Data)`});
        return this.handleError(err);
      }));
  }

  getForecast(city: string): Observable<Forecast16Response> {
    if (this.apiKey.includes('openweathermap.org') || this.apiKey === 'b6907d289e10d714a6e88b30761fae22') {
      return of(this.mockForecast16);
    }
    return this.http.get<Forecast16Response>(`${this.apiUrl}/forecast/daily?q=${city}&cnt=7&units=metric&appid=${this.apiKey}`)
      .pipe(catchError((err) => {
        if (err.status === 401) return of(this.mockForecast16);
        return this.handleError(err);
      }));
  }

  getForecastByCoords(lat: number, lon: number): Observable<Forecast16Response> {
    if (this.apiKey.includes('openweathermap.org') || this.apiKey === 'b6907d289e10d714a6e88b30761fae22') {
      return of(this.mockForecast16);
    }
    return this.http.get<Forecast16Response>(`${this.apiUrl}/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${this.apiKey}`)
      .pipe(catchError((err) => {
        if (err.status === 401) return of(this.mockForecast16);
        return this.handleError(err);
      }));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = 'City not found. Please try again.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenWeatherMap key.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
