import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../environments/environment';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fallback to mock data when API key is default/invalid for current weather', (done) => {
    // If the API key is the default one, it should immediately return mock data via `of()`
    service.getCurrentWeather('London').subscribe(data => {
      expect(data.name).toContain('Mock Data');
      expect(data.cod).toBe(200);
      done();
    });
    
    // No HTTP request should be made if we hit the mock branch
    httpMock.expectNone(`${environment.apiUrl}/weather?q=London&units=metric&appid=${environment.openWeatherApiKey}`);
  });

  it('should fallback to mock data for forecast16', (done) => {
    service.getForecast('London').subscribe(data => {
      expect(data.cnt).toBe(7); // our mock forecast size
      done();
    });
    
    httpMock.expectNone(`${environment.apiUrl}/forecast/daily?q=London&cnt=7&units=metric&appid=${environment.openWeatherApiKey}`);
  });
});
