import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Category, 
  Product, 
  ProductItem, 
  ProductMovement, 
  InventoryReport, 
  MovementReport, 
  ReportFilter,
  ListResponse
} from '../models/warehouse.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<ListResponse<Category>> {
    return this.http.get<ListResponse<Category>>(`${this.apiUrl}/categories/`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}/`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}/`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`);
  }

  // Products
  getProducts(): Observable<ListResponse<Product>> {
    return this.http.get<ListResponse<Product>>(`${this.apiUrl}/products/`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}/`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}/`);
  }

  // Inventory (Product Items)
  getInventory(filters?: Record<string, any>): Observable<ListResponse<ProductItem>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ListResponse<ProductItem>>(`${this.apiUrl}/product-items/`, { params });
  }

  getInventoryItemById(id: number): Observable<ProductItem> {
    return this.http.get<ProductItem>(`${this.apiUrl}/product-items/${id}/`);
  }

  createInventoryItem(item: Partial<ProductItem>): Observable<ProductItem> {
    return this.http.post<ProductItem>(`${this.apiUrl}/product-items/`, item);
  }

  updateInventoryItem(id: number, item: Partial<ProductItem>): Observable<ProductItem> {
    return this.http.put<ProductItem>(`${this.apiUrl}/product-items/${id}/`, item);
  }

  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product-items/${id}/`);
  }

  // Movements
  getMovements(filters?: Record<string, any>): Observable<ListResponse<ProductMovement>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ListResponse<ProductMovement>>(`${this.apiUrl}/product-movements/`, { params });
  }

  getMovementById(id: number): Observable<ProductMovement> {
    return this.http.get<ProductMovement>(`${this.apiUrl}/product-movements/${id}/`);
  }

  createMovement(movement: Partial<ProductMovement>): Observable<ProductMovement> {
    return this.http.post<ProductMovement>(`${this.apiUrl}/product-movements/`, movement);
  }

  updateMovement(id: number, movement: Partial<ProductMovement>): Observable<ProductMovement> {
    return this.http.put<ProductMovement>(`${this.apiUrl}/product-movements/${id}/`, movement);
  }

  deleteMovement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product-movements/${id}/`);
  }

  // Reports
  getInventoryReport(filters?: ReportFilter): Observable<InventoryReport> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<InventoryReport>(`${this.apiUrl}/reports/inventory/`, { params });
  }

  getMovementReport(filters?: ReportFilter): Observable<MovementReport> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<MovementReport>(`${this.apiUrl}/reports/movements/`, { params });
  }
} 