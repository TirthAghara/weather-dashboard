import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { WeatherService } from '../../services/weather.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let weatherServiceSpy: jasmine.SpyObj<WeatherService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const weatherSpy = jasmine.createSpyObj('WeatherService', ['getCurrentWeather', 'getCurrentWeatherByCoords', 'getForecast', 'getForecastByCoords']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: WeatherService, useValue: weatherSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    weatherServiceSpy = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Prevent ngOnInit from firing immediately before we can set up spys
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform search and update state correctly', () => {
    weatherServiceSpy.getCurrentWeather.and.returnValue(of({} as any));
    weatherServiceSpy.getForecast.and.returnValue(of({} as any));

    component.searchWeather('London');

    expect(component.lastSearchType).toBe('city');
    expect(component.lastCity).toBe('London');
    expect(component.loading()).toBeFalse(); // After both requests complete
    expect(weatherServiceSpy.getCurrentWeather).toHaveBeenCalledWith('London');
  });

  it('should handle API errors and set error state', () => {
    const errorMsg = 'City not found';
    weatherServiceSpy.getCurrentWeather.and.returnValue(throwError(() => new Error(errorMsg)));

    component.searchWeather('FakeCity');

    expect(component.error()).toBe(errorMsg);
    expect(component.loading()).toBeFalse();
  });

  it('should logout and redirect', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
