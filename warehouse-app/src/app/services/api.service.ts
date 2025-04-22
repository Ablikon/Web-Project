import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  // Helper method to get headers with auth token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Token ${token}` : ''
    });
  }

  // Authentication
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password });
  }

  // Categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/`, { headers: this.getHeaders() });
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${id}/`, { headers: this.getHeaders() });
  }

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/`, { headers: this.getHeaders() });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}/`, { headers: this.getHeaders() });
  }

  // Product Items
  getProductItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-items/`, { headers: this.getHeaders() });
  }

  getProductItemById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-items/${id}/`, { headers: this.getHeaders() });
  }

  // Product Movements
  getProductMovements(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-movements/`, { headers: this.getHeaders() });
  }

  getProductMovementById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-movements/${id}/`, { headers: this.getHeaders() });
  }

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/`, { headers: this.getHeaders() });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/`, { headers: this.getHeaders() });
  }
} 