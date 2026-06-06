import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-weather-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.css'
})
export class WeatherMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() lat: number | undefined;
  @Input() lon: number | undefined;

  private map: any = null;
  private marker: any = null;
  private L: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isPlatformBrowser(this.platformId) && (changes['lat'] || changes['lon']) && this.map) {
      this.updateMapLocation();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initMap() {
    if (this.lat === undefined || this.lon === undefined) return;

    // Dynamically import Leaflet only in the browser to avoid SSR window errors
    this.L = await import('leaflet');
    
    // Fix for Leaflet marker icon issue in Angular
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    
    this.L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
    });

    this.map = this.L.map('weather-map').setView([this.lat, this.lon], 10);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.marker = this.L.marker([this.lat, this.lon]).addTo(this.map);
  }

  private updateMapLocation() {
    if (!this.map || !this.L || this.lat === undefined || this.lon === undefined) return;

    this.map.setView([this.lat, this.lon], 10);
    
    if (this.marker) {
      this.marker.setLatLng([this.lat, this.lon]);
    } else {
      this.marker = this.L.marker([this.lat, this.lon]).addTo(this.map);
    }
  }
}
