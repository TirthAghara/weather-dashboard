import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with false if not logged in', (done) => {
    service.isAuthenticated$.subscribe(isAuth => {
      expect(isAuth).toBeFalse();
      done();
    });
  });

  it('should return true and set state on valid login', () => {
    const result = service.login('password');
    expect(result).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('should return false and not set state on invalid login', () => {
    const result = service.login('wrongpassword');
    expect(result).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should reset state on logout', () => {
    service.login('password');
    expect(service.isLoggedIn()).toBeTrue();
    
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });
});
