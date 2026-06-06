import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Forecast16Response } from '../../models/weather.model';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-chart.html',
  styleUrl: './weather-chart.css'
})
export class WeatherChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() forecast: Forecast16Response | null = null;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('secondaryChartCanvas') secondaryChartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: any = null;
  private secondaryChart: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isPlatformBrowser(this.platformId) && changes['forecast'] && this.forecast) {
      setTimeout(() => {
        this.renderChart();
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.secondaryChart) {
      this.secondaryChart.destroy();
    }
  }

  private async renderChart() {
    if (!this.forecast || !this.chartCanvas || !this.secondaryChartCanvas) return;

    // Dynamically import Chart.js only in the browser
    const { default: Chart } = await import('chart.js/auto');

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.secondaryChart) {
      this.secondaryChart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const ctx2 = this.secondaryChartCanvas.nativeElement.getContext('2d');
    if (!ctx || !ctx2) return;

    // We only take the first 7 days for the chart
    const sevenDays = this.forecast.list.slice(0, 7);
    const labels = sevenDays.map(day => new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' }));
    
    // Dataset for primary chart (Temp)
    const maxTemps = sevenDays.map(day => day.temp.max);
    const minTemps = sevenDays.map(day => day.temp.min);

    // Dataset for secondary chart (Humidity/Wind)
    const humidity = sevenDays.map(day => day.humidity);
    const windSpeed = sevenDays.map(day => day.speed);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Max Temp (°C)',
            data: maxTemps,
            borderColor: '#eb6e4b', // OWM Orange
            backgroundColor: 'rgba(235, 110, 75, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#eb6e4b',
          },
          {
            label: 'Min Temp (°C)',
            data: minTemps,
            borderColor: '#4a90e2', // Blue
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#4a90e2',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: { display: true, title: { display: true, text: 'Temperature (°C)' } }
        }
      }
    });

    this.secondaryChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Humidity (%)',
            data: humidity,
            backgroundColor: 'rgba(74, 144, 226, 0.6)',
            borderColor: '#4a90e2',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: 'Wind Speed (m/s)',
            data: windSpeed,
            borderColor: '#8e44ad', // Purple
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#8e44ad',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: { 
            type: 'linear', 
            display: true, 
            position: 'left',
            title: { display: true, text: 'Humidity (%)' }
          },
          y1: { 
            type: 'linear', 
            display: true, 
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Wind (m/s)' }
          }
        }
      }
    });
  }
}
