import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  login(email: string, pass: string): boolean {
    if (email === 'admin@pgconcordia.com' && pass === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      this.isAdminSubject.next(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.isAdminSubject.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isAdminSubject.value;
  }
}
