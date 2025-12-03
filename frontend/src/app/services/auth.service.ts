import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAdminSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(email: string, pass: string): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password: pass }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        this.isAdminSubject.next(true);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAdminSubject.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isAdminSubject.value;
  }
}
