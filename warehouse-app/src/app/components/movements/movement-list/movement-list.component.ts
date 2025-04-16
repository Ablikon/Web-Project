import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ProductMovement } from '../../../models/product.interface';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="movement-container">
      <div class="header">
        <h1>Product Movements</h1>
        <a routerLink="/movements/new" class="btn primary">Record Movement</a>
      </div>
      
      <div class="filters">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search product movements..." 
          class="search-input"
        />
        
        <div class="filter-buttons">
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === ''" 
            (click)="filterMovements('')"
          >
            All
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'receipt'" 
            (click)="filterMovements('receipt')"
          >
            Receipts
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'writeoff'" 
            (click)="filterMovements('writeoff')"
          >
            Write-offs
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter === 'transfer'" 
            (click)="filterMovements('transfer')"
          >
            Transfers
          </button>
        </div>
      </div>
      
      <div class="movement-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Previous Qty</th>
              <th>New Qty</th>
              <th>Change</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of filteredMovements">
              <td>{{ movement.created_at | date:'short' }}</td>
              <td>{{ getProductName(movement) }}</td>
              <td>
                <span class="badge" [ngClass]="getTypeClass(movement.movement_type)">
                  {{ formatMovementType(movement.movement_type) }}
                </span>
              </td>
              <td>{{ movement.previous_quantity }}</td>
              <td>{{ movement.new_quantity }}</td>
              <td>
                <span [ngClass]="getChangeClass(movement)">
                  {{ formatQuantityChange(movement) }}
                </span>
              </td>
              <td>{{ movement.price | currency }}</td>
            </tr>
            <tr *ngIf="filteredMovements.length === 0">
              <td colspan="7" class="empty-state">No movements found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .movement-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
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
    
    .filters {
      margin-bottom: 20px;
    }
    
    .search-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
      margin-bottom: 15px;
    }
    
    .filter-buttons {
      display: flex;
      gap: 10px;
    }
    
    .filter-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .filter-btn.active {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
    }
    
    .movement-table {
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
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .receipt {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .writeoff {
      background-color: #ffebee;
      color: #c62828;
    }
    
    .transfer {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .positive {
      color: #2e7d32;
    }
    
    .negative {
      color: #c62828;
    }
    
    .empty-state {
      text-align: center;
      padding: 30px;
      color: #757575;
    }
  `
})
export class MovementListComponent implements OnInit {
  movements: ProductMovement[] = [];
  filteredMovements: ProductMovement[] = [];
  searchTerm = '';
  activeFilter = '';
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadMovements();
  }
  
  loadMovements(): void {
    this.productService.getProductMovements().subscribe(movements => {
      this.movements = movements;
      this.applyFilters();
    });
  }
  
  filterMovements(type: string): void {
    this.activeFilter = type;
    this.applyFilters();
  }
  
  applyFilters(): void {
    let result = this.movements;
    
    // Apply movement type filter
    if (this.activeFilter) {
      result = result.filter(m => m.movement_type === this.activeFilter);
    }
    
    // Apply search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(m => 
        this.getProductName(m).toLowerCase().includes(term) ||
        m.movement_type.toLowerCase().includes(term)
      );
    }
    
    this.filteredMovements = result;
  }
  
  getProductName(movement: ProductMovement): string {
    if (typeof movement.product_item === 'object' && movement.product_item !== null) {
      if (typeof movement.product_item.product === 'object' && movement.product_item.product !== null) {
        return movement.product_item.product.name;
      }
    }
    return 'Unknown Product';
  }
  
  formatMovementType(type: string): string {
    switch (type) {
      case 'receipt':
        return 'Receipt';
      case 'writeoff':
        return 'Write-off';
      case 'transfer':
        return 'Transfer';
      default:
        return type;
    }
  }
  
  getTypeClass(type: string): string {
    return type;
  }
  
  getChangeClass(movement: ProductMovement): string {
    if (movement.movement_type === 'receipt') {
      return 'positive';
    } else if (movement.movement_type === 'writeoff') {
      return 'negative';
    }
    return '';
  }
  
  formatQuantityChange(movement: ProductMovement): string {
    if (movement.movement_type === 'receipt') {
      return `+${movement.quantity}`;
    } else if (movement.movement_type === 'writeoff') {
      return `-${movement.quantity}`;
    }
    return `${movement.quantity}`;
  }
} 