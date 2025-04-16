import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { ProductItem } from '../../../models/product.interface';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h1>Inventory</h1>
        <div class="actions">
          <a *ngIf="canManageInventory" routerLink="/inventory/add" class="btn primary">Add Item</a>
          <a *ngIf="canManageInventory" routerLink="/movements/new" class="btn secondary">Record Movement</a>
        </div>
      </div>
      
      <div class="filters">
        <input type="text" placeholder="Search products..." (input)="applyFilter($event)" />
      </div>
      
      <div class="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Status</th>
              <th *ngIf="canManageInventory">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredItems">
              <td>{{ getProductName(item) }}</td>
              <td>{{ getCategoryName(item) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ getUnit(item) }}</td>
              <td>
                <span class="status" [ngClass]="getStatusClass(item)">
                  {{ getStatus(item) }}
                </span>
              </td>
              <td *ngIf="canManageInventory">
                <button class="btn-icon" (click)="showMovementHistory(item)">
                  <span>History</span>
                </button>
                <button class="btn-icon" routerLink="/movements/new" [queryParams]="{productId: item.id}">
                  <span>Movement</span>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="6" class="empty-state">No inventory items found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .inventory-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }
    
    .primary {
      background-color: #1976d2;
      color: white;
    }
    
    .secondary {
      background-color: #455a64;
      color: white;
    }
    
    .filters {
      margin-bottom: 20px;
    }
    
    input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
    }
    
    .inventory-table {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .empty-state {
      text-align: center;
      padding: 30px;
      color: #757575;
    }
    
    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .ok {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .warning {
      background-color: #fff8e1;
      color: #ff8f00;
    }
    
    .critical {
      background-color: #ffebee;
      color: #c62828;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: #1976d2;
      cursor: pointer;
      margin-right: 10px;
      font-weight: 500;
      font-size: 13px;
    }
  `
})
export class InventoryListComponent implements OnInit {
  inventoryItems: ProductItem[] = [];
  filteredItems: ProductItem[] = [];
  canManageInventory = false;
  
  constructor(
    private productService: ProductService, 
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadInventoryItems();
    this.canManageInventory = this.authService.isManager() || this.authService.isAdmin();
  }
  
  loadInventoryItems(): void {
    this.productService.getProductItems().subscribe(items => {
      this.inventoryItems = items;
      this.filteredItems = [...items];
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.inventoryItems.filter(item => {
      const productName = this.getProductName(item).toLowerCase();
      const categoryName = this.getCategoryName(item).toLowerCase();
      return productName.includes(filterValue) || categoryName.includes(filterValue);
    });
  }
  
  getProductName(item: ProductItem): string {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.name;
    }
    return 'Unknown Product';
  }
  
  getCategoryName(item: ProductItem): string {
    if (typeof item.product === 'object' && item.product !== null) {
      if (typeof item.product.category === 'object' && item.product.category !== null) {
        return item.product.category.name;
      }
    }
    return 'Uncategorized';
  }
  
  getUnit(item: ProductItem): string {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.unit;
    }
    return '';
  }
  
  getStatus(item: ProductItem): string {
    if (item.quantity <= 0) {
      return 'Out of Stock';
    } else if (item.quantity < 10) { // Threshold value
      return 'Low Stock';
    }
    return 'In Stock';
  }
  
  getStatusClass(item: ProductItem): string {
    if (item.quantity <= 0) {
      return 'critical';
    } else if (item.quantity < 10) { // Threshold value
      return 'warning';
    }
    return 'ok';
  }
  
  showMovementHistory(item: ProductItem): void {
    // This would be implemented to show a modal or navigate to a history page
    console.log('Show history for:', item);
  }
} 