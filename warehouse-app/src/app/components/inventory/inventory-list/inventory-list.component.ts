import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ProductItem } from '../../../models/warehouse.models';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Inventory</h1>
        <div class="header-actions">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search inventory..." 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
            >
          </div>
          <button class="add-button" routerLink="/inventory/new">Add Item</button>
        </div>
      </div>

      <div class="filters">
        <div class="filter-options">
          <select [(ngModel)]="sortBy" (change)="applyFilters()">
            <option value="product">Sort by Product</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
        </div>
      </div>

      <div class="inventory-table-container" *ngIf="filteredInventory.length > 0; else noItems">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredInventory">
              <td>{{ item.product_details?.name || 'Unknown Product' }}</td>
              <td>{{ item.quantity }}</td>
              <td class="actions">
                <button class="view-button" [routerLink]="['/inventory', item.id]">View</button>
                <button class="edit-button" [routerLink]="['/inventory/edit', item.id]">Edit</button>
                <button class="delete-button" (click)="deleteItem(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noItems>
        <div class="empty-state">
          <p>No inventory items found. Add items to your inventory to get started.</p>
          <button class="add-button" routerLink="/inventory/new">Add Item</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .search-box {
      position: relative;
    }

    .search-box input {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 250px;
      transition: all 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .filters {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-options select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }

    .inventory-table-container {
      overflow-x: auto;
    }

    .inventory-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: white;
    }

    .inventory-table th,
    .inventory-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .inventory-table th {
      background-color: #f8f8f8;
      font-weight: bold;
    }

    .inventory-table tr:hover {
      background-color: #f5f5f5;
    }

    .status-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status-in_stock {
      background-color: #4CAF50;
      color: white;
    }

    .status-sold {
      background-color: #2196F3;
      color: white;
    }

    .status-reserved {
      background-color: #FF9800;
      color: white;
    }

    .status-defective {
      background-color: #f44336;
      color: white;
    }

    .actions {
      display: flex;
      gap: 5px;
    }

    .view-button, .edit-button, .delete-button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .view-button {
      background-color: #9E9E9E;
      color: white;
    }

    .edit-button {
      background-color: #2196F3;
      color: white;
    }

    .delete-button {
      background-color: #f44336;
      color: white;
    }

    .add-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      background-color: #f8f8f8;
      border-radius: 8px;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
        margin-top: 10px;
      }

      .search-box input {
        width: 100%;
      }
    }
  `]
})
export class InventoryListComponent implements OnInit {
  inventory: ProductItem[] = [];
  filteredInventory: ProductItem[] = [];
  searchTerm = '';
  sortBy = 'product';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.apiService.getInventory().subscribe({
      next: (response) => {
        if (response && response.results) {
          this.inventory = response.results || [];
          this.filteredInventory = [...this.inventory];
          this.sortInventory();
        } else {
          console.error('Invalid API response format:', response);
          this.inventory = [];
          this.filteredInventory = [];
        }
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.inventory = [];
        this.filteredInventory = [];
      }
    });
  }

  applyFilters(): void {
    // Filter by search term
    let filtered = this.inventory;
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        (item.product_details?.name && item.product_details.name.toLowerCase().includes(search))
      );
    }
    
    this.filteredInventory = filtered;
    this.sortInventory();
  }

  sortInventory(): void {
    switch (this.sortBy) {
      case 'product':
        this.filteredInventory.sort((a, b) => {
          const nameA = a.product_details?.name?.toLowerCase() || '';
          const nameB = b.product_details?.name?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case 'quantity':
        this.filteredInventory.sort((a, b) => {
          return b.quantity - a.quantity; // Highest first
        });
        break;
    }
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteInventoryItem(id).subscribe({
        next: () => {
          this.inventory = this.inventory.filter(item => item.id !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }
} 