import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ProductMovement } from '../../../models/warehouse.models';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Movements</h1>
        <div class="header-actions">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search movements..." 
              [(ngModel)]="searchTerm" 
              (input)="applyFilters()"
            >
          </div>
          <button class="add-button" routerLink="/movements/new">Add Movement</button>
        </div>
      </div>

      <div class="filters">
        <div class="filter-options">
          <select [(ngModel)]="typeFilter" (change)="applyFilters()">
            <option value="">All Types</option>
            <option value="receipt">Receipt</option>
            <option value="sale">Sale</option>
            <option value="transfer">Transfer</option>
            <option value="return">Return</option>
          </select>
          
          <select [(ngModel)]="sortBy" (change)="applyFilters()">
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
        </div>
      </div>

      <div class="date-range">
        <div class="date-input">
          <label for="startDate">From:</label>
          <input 
            type="date" 
            id="startDate" 
            [(ngModel)]="startDate" 
            (change)="applyFilters()"
          >
        </div>
        <div class="date-input">
          <label for="endDate">To:</label>
          <input 
            type="date" 
            id="endDate" 
            [(ngModel)]="endDate" 
            (change)="applyFilters()"
          >
        </div>
        <button class="clear-button" (click)="clearDateFilters()">Clear Dates</button>
      </div>

      <div class="movements-table-container" *ngIf="filteredMovements.length > 0; else noMovements">
        <table class="movements-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of filteredMovements">
              <td>{{ movement.created_at | date: 'mediumDate' }}</td>
              <td>{{ movement.product_item_details?.product_details?.name || 'Unknown Product' }}</td>
              <td>
                <span class="movement-badge" [ngClass]="'movement-' + movement.movement_type">
                  {{ getTypeLabel(movement.movement_type) }}
                </span>
              </td>
              <td>{{ movement.quantity }}</td>
              <td>{{ movement.created_by_details?.username || 'Unknown User' }}</td>
              <td class="actions">
                <button class="view-button" [routerLink]="['/movements', movement.id]">View</button>
                <button class="edit-button" [routerLink]="['/movements/edit', movement.id]">Edit</button>
                <button class="delete-button" (click)="deleteMovement(movement.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noMovements>
        <div class="empty-state">
          <p>No movements found. Create a movement to get started.</p>
          <button class="add-button" routerLink="/movements/new">Add Movement</button>
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

    .date-range {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .date-input {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .date-input label {
      font-weight: bold;
    }

    .date-input input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .clear-button {
      padding: 8px 16px;
      background-color: #9E9E9E;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .movements-table-container {
      overflow-x: auto;
    }

    .movements-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: white;
    }

    .movements-table th,
    .movements-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .movements-table th {
      background-color: #f8f8f8;
      font-weight: bold;
    }

    .movements-table tr:hover {
      background-color: #f5f5f5;
    }

    .movement-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .movement-receipt {
      background-color: #4CAF50;
      color: white;
    }

    .movement-sale {
      background-color: #2196F3;
      color: white;
    }

    .movement-transfer {
      background-color: #FF9800;
      color: white;
    }

    .movement-return {
      background-color: #9C27B0;
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
export class MovementListComponent implements OnInit {
  movements: ProductMovement[] = [];
  filteredMovements: ProductMovement[] = [];
  searchTerm = '';
  typeFilter = '';
  sortBy = 'date';
  startDate = '';
  endDate = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.apiService.getMovements().subscribe({
      next: (response) => {
        this.movements = response.results;
        this.filteredMovements = [...this.movements];
        this.sortMovements();
      },
      error: (error) => {
        console.error('Error loading movements:', error);
      }
    });
  }

  applyFilters(): void {
    // Filter by search term
    let filtered = this.movements;
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(movement => 
        (movement.product_item_details?.product_details?.name && 
          movement.product_item_details.product_details.name.toLowerCase().includes(search)) ||
        (movement.movement_type && 
          movement.movement_type.toLowerCase().includes(search))
      );
    }
    
    // Filter by movement type
    if (this.typeFilter) {
      filtered = filtered.filter(movement => movement.movement_type === this.typeFilter);
    }
    
    // Filter by date range
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(movement => new Date(movement.created_at) >= start);
    }
    
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59); // End of the day
      filtered = filtered.filter(movement => new Date(movement.created_at) <= end);
    }
    
    this.filteredMovements = filtered;
    this.sortMovements();
  }

  sortMovements(): void {
    switch (this.sortBy) {
      case 'date':
        this.filteredMovements.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Newest first
        });
        break;
      case 'type':
        this.filteredMovements.sort((a, b) => a.movement_type.localeCompare(b.movement_type));
        break;
      case 'quantity':
        this.filteredMovements.sort((a, b) => b.quantity - a.quantity); // Highest first
        break;
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'receipt': return 'Receipt';
      case 'sale': return 'Sale';
      case 'transfer': return 'Transfer';
      case 'return': return 'Return';
      default: return type;
    }
  }

  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  deleteMovement(id: number): void {
    if (confirm('Are you sure you want to delete this movement?')) {
      this.apiService.deleteMovement(id).subscribe({
        next: () => {
          this.movements = this.movements.filter(movement => movement.id !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting movement:', error);
        }
      });
    }
  }
} 