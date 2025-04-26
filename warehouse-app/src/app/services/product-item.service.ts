import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductItem } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductItemService {
  private apiUrl = `${environment.apiUrl}/product-items/`;

  constructor(private http: HttpClient) { }

  getProductItems(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(this.apiUrl);
  }

  getProductItem(id: number): Observable<ProductItem> {
    return this.http.get<ProductItem>(`${this.apiUrl}${id}`);
  }

  createProductItem(productItem: Omit<ProductItem, 'id'>): Observable<ProductItem> {
    return this.http.post<ProductItem>(this.apiUrl, productItem);
  }

  updateProductItem(id: number, productItem: Partial<ProductItem>): Observable<ProductItem> {
    return this.http.put<ProductItem>(`${this.apiUrl}${id}`, productItem);
  }

  deleteProductItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
} 