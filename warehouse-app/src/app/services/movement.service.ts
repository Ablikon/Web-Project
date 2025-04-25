import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductMovement } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private apiUrl = `${environment.apiUrl}/product-movements/`;

  constructor(private http: HttpClient) { }

  getMovements(): Observable<{ results: ProductMovement[] }> {
    return this.http.get<{ results: ProductMovement[] }>(this.apiUrl);
  }

  getMovement(id: number): Observable<ProductMovement> {
    return this.http.get<ProductMovement>(`${this.apiUrl}${id}/`);
  }

  createMovement(movement: {
    product_item: number;
    movement_type: string;
    quantity: number;
    price: number;
  }): Observable<ProductMovement> {
    return this.http.post<ProductMovement>(this.apiUrl, movement);
  }

  updateMovement(id: number, movement: {
    product_item: number;
    movement_type: string;
    quantity: number;
    price: number;
  }): Observable<ProductMovement> {
    return this.http.put<ProductMovement>(`${this.apiUrl}${id}/`, movement);
  }

  deleteMovement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
} 