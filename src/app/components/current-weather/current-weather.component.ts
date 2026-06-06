import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent {
  @Input() weather!: CurrentWeather;

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  }
}
