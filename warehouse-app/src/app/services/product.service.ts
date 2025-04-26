import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products/`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log('Getting all products');
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    console.log(`Getting product with id ${id}`);
    return this.http.get<Product>(`${this.apiUrl}${id}/`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    console.log('Creating product:', product);
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    console.log(`Updating product with id ${id}:`, product);
    return this.http.put<Product>(`${this.apiUrl}${id}/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    console.log(`Deleting product with id ${id}`);
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
} 