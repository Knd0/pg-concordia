import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payment';
  private shippingUrl = environment.apiUrl + '/shipping';

  constructor(private http: HttpClient) { }

  getAuthUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/auth`);
  }

  createPreference(items: any[], shippingCost: number): Observable<{ init_point: string, sandbox_init_point: string }> {
    return this.http.post<{ init_point: string, sandbox_init_point: string }>(`${this.apiUrl}/preference`, { items, shippingCost });
  }

  calculateShipping(zipCode: string): Observable<{ cost: number }> {
    return this.http.get<{ cost: number }>(`${this.shippingUrl}/calculate?zipCode=${zipCode}`);
  }
  
  getStatus(): Observable<{ linked: boolean }> {
      return this.http.get<{ linked: boolean }>(`${this.apiUrl}/status`);
  }
}
