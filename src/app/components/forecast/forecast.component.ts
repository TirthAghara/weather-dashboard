import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Forecast16Response, Forecast16Item } from '../../models/weather.model';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnChanges {
  @Input() forecast!: Forecast16Response;
  
  sevenDayForecast: Forecast16Item[] = [];
  fourDayAverageTemp: number = 0;
  fourDayAverageHigh: number = 0;
  fourDayAverageLow: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forecast'] && this.forecast && this.forecast.list) {
      this.processForecast();
    }
  }

  private processForecast() {
    // Take up to 7 days
    this.sevenDayForecast = this.forecast.list.slice(0, 7);

    // Calculate averages for the upcoming 4 days (days index 1 through 4)
    const upcoming4Days = this.forecast.list.slice(1, 5);
    if (upcoming4Days.length > 0) {
      this.fourDayAverageTemp = upcoming4Days.reduce((sum, item) => sum + item.temp.day, 0) / upcoming4Days.length;
      this.fourDayAverageHigh = upcoming4Days.reduce((sum, item) => sum + item.temp.max, 0) / upcoming4Days.length;
      this.fourDayAverageLow = upcoming4Days.reduce((sum, item) => sum + item.temp.min, 0) / upcoming4Days.length;
    }
  }

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
