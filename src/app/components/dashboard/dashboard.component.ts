import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CurrentWeather, Forecast16Response } from '../../models/weather.model';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { WeatherChartComponent } from '../weather-chart/weather-chart';
import { WeatherMapComponent } from '../weather-map/weather-map';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, CurrentWeatherComponent, ForecastComponent, WeatherChartComponent, WeatherMapComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentWeather: CurrentWeather | null = null;
  forecast: Forecast16Response | null = null;
  loading = signal(false);
  error = signal<string | null>(null);

  lastSearchType: 'city' | 'coords' | null = null;
  lastCity: string = '';
  lastLat: number = 0;
  lastLon: number = 0;

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading.set(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation denied or failed, defaulting to Bengaluru', err);
          this.searchWeather('Bengaluru');
        }
      );
    } else {
      this.searchWeather('Bengaluru');
    }
  }

  fetchWeatherByCoords(lat: number, lon: number) {
    this.lastSearchType = 'coords';
    this.lastLat = lat;
    this.lastLon = lon;
    
    this.loading.set(true);
    this.error.set(null);
    this.currentWeather = null;
    this.forecast = null;

    this.weatherService.getCurrentWeatherByCoords(lat, lon).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.getForecastByCoords(lat, lon);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  searchWeather(city: string) {
    if (!city) return;
    
    this.lastSearchType = 'city';
    this.lastCity = city;

    this.loading.set(true);
    this.error.set(null);
    this.currentWeather = null;
    this.forecast = null;

    this.weatherService.getCurrentWeather(city).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.getForecast(city);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  retrySearch() {
    if (this.lastSearchType === 'city') {
      this.searchWeather(this.lastCity);
    } else if (this.lastSearchType === 'coords') {
      this.fetchWeatherByCoords(this.lastLat, this.lastLon);
    } else {
      this.searchWeather('Bengaluru');
    }
  }

  private getForecast(city: string) {
    this.weatherService.getForecast(city).subscribe({
      next: (data) => {
        this.forecast = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to get forecast', err);
        // Display current weather anyway, but stop loading
        this.loading.set(false);
      }
    });
  }

  private getForecastByCoords(lat: number, lon: number) {
    this.weatherService.getForecastByCoords(lat, lon).subscribe({
      next: (data) => {
        this.forecast = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to get forecast by coords', err);
        this.loading.set(false);
      }
    });
  }
}
