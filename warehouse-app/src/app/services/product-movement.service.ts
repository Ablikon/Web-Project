import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductMovement } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductMovementService {
  private apiUrl = `${environment.apiUrl}/product-movements/`;

  constructor(private http: HttpClient) { }

  getProductMovements(): Observable<ProductMovement[]> {
    return this.http.get<ProductMovement[]>(this.apiUrl);
  }

  getProductMovement(id: number): Observable<ProductMovement> {
    return this.http.get<ProductMovement>(`${this.apiUrl}${id}`);
  }

  createProductMovement(movement: Omit<ProductMovement, 'id' | 'created_at' | 'created_by'>): Observable<ProductMovement> {
    return this.http.post<ProductMovement>(this.apiUrl, movement);
  }

  // For product receipt (adding to inventory)
  addProductStock(productItemId: number, quantity: number, price: number): Observable<ProductMovement> {
    return this.createProductMovement({
      movement_type: 'receipt',
      product_item: productItemId,
      quantity,
      price,
      previous_quantity: 0, // These will be calculated by the backend
      new_quantity: 0 // These will be calculated by the backend
    });
  }

  // For product write-off (removing from inventory)
  writeOffProductStock(productItemId: number, quantity: number, price: number): Observable<ProductMovement> {
    return this.createProductMovement({
      movement_type: 'writeoff',
      product_item: productItemId,
      quantity,
      price,
      previous_quantity: 0, // These will be calculated by the backend
      new_quantity: 0 // These will be calculated by the backend
    });
  }
} 