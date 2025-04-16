import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, ProductItem, ProductMovement, DashboardStats, InventoryAlert } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Category endpoints
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}/`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}/`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`);
  }

  // Product endpoints
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}/`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}/`);
  }

  // Product item endpoints
  getProductItems(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(`${this.apiUrl}/product-items/`);
  }

  getProductItem(id: number): Observable<ProductItem> {
    return this.http.get<ProductItem>(`${this.apiUrl}/product-items/${id}/`);
  }

  createProductItem(productItem: ProductItem): Observable<ProductItem> {
    return this.http.post<ProductItem>(`${this.apiUrl}/product-items/`, productItem);
  }

  updateProductItem(id: number, productItem: ProductItem): Observable<ProductItem> {
    return this.http.put<ProductItem>(`${this.apiUrl}/product-items/${id}/`, productItem);
  }

  deleteProductItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product-items/${id}/`);
  }

  // Product movement endpoints
  getProductMovements(): Observable<ProductMovement[]> {
    return this.http.get<ProductMovement[]>(`${this.apiUrl}/product-movements/`);
  }

  getProductMovement(id: number): Observable<ProductMovement> {
    return this.http.get<ProductMovement>(`${this.apiUrl}/product-movements/${id}/`);
  }

  createProductMovement(movement: ProductMovement): Observable<ProductMovement> {
    return this.http.post<ProductMovement>(`${this.apiUrl}/product-movements/`, movement);
  }

  // Dashboard and reports
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/`);
  }

  getLowStockAlerts(): Observable<InventoryAlert[]> {
    return this.http.get<InventoryAlert[]>(`${this.apiUrl}/inventory-alerts/`);
  }

  generateInventoryReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/inventory/`, { responseType: 'blob' });
  }

  generateMovementReport(startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/reports/movements/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }
} 