import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  stock: number;
  isOffer?: boolean;
  offerPrice?: number;
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(filters?: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params: filters });
  }

  updateProduct(id: number, data: any): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, data);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  finalizeOrder(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${id}/finalize`, {});
  }

  updateOrderDescription(id: number, description: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${id}/description`, { description });
  }

  updateOrder(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${id}`, data);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }
}
