import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check local storage for existing session
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(password: string): boolean {
    if (password === 'password') {
      this.isAuthenticatedSubject.next(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
      }
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticatedSubject.next(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
