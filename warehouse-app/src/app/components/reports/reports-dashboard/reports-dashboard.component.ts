import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { InventoryReport, MovementReport, ReportFilter } from '../../../models/warehouse.models';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Reports Dashboard</h1>
      </div>

      <div class="filter-section">
        <h2>Report Filters</h2>
        <div class="filter-grid">
          <div class="filter-item">
            <label for="startDate">Start Date</label>
            <input type="date" id="startDate" [(ngModel)]="filters.start_date" (change)="applyFilters()">
          </div>
          <div class="filter-item">
            <label for="endDate">End Date</label>
            <input type="date" id="endDate" [(ngModel)]="filters.end_date" (change)="applyFilters()">
          </div>
          <div class="filter-item">
            <label for="category">Category</label>
            <select id="category" [(ngModel)]="filters.category" (change)="applyFilters()">
              <option [ngValue]="undefined">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label for="movementType">Movement Type</label>
            <select id="movementType" [(ngModel)]="filters.movement_type" (change)="applyFilters()">
              <option [ngValue]="undefined">All Types</option>
              <option value="writeoff">Write-off</option>
              <option value="receipt">Receipt</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="clear-button" (click)="clearFilters()">Clear Filters</button>
            <button class="apply-button" (click)="applyFilters()">Apply Filters</button>
          </div>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <h2>Inventory Summary</h2>
          <div class="summary-stats">
            <div class="stat-item">
              <div class="stat-value">{{ inventoryReport?.total_items || 0 }}</div>
              <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatCurrency(inventoryReport?.total_value) }}</div>
              <div class="stat-label">Total Value</div>
            </div>
          </div>

          <div class="category-table">
            <h3>Items by Category</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let category of inventoryReport?.items_by_category">
                  <td>{{ category.category }}</td>
                  <td>{{ category.count }}</td>
                  <td>{{ formatCurrency(category.value) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="report-card">
          <h2>Movement Activity</h2>
          
          <div class="movement-type-chart">
            <h3>Movements by Type</h3>
            <div class="chart-container">
              <div *ngFor="let type of movementReport?.movements_by_type" class="chart-bar">
                <div class="bar-label">{{ getMovementTypeLabel(type.type) }}</div>
                <div class="bar-container">
                  <div 
                    class="bar" 
                    [ngClass]="'movement-' + type.type"
                    [style.width.%]="getMovementTypePercentage(type.count)"
                  ></div>
                  <div class="bar-value">{{ type.count }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="date-table">
            <h3>Movement by Date</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let date of movementReport?.movements_by_date">
                  <td>{{ date.date | date: 'mediumDate' }}</td>
                  <td>{{ date.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      margin-bottom: 20px;
    }

    .filter-section {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filter-section h2 {
      margin-top: 0;
      margin-bottom: 15px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
    }

    .filter-item label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .filter-item input,
    .filter-item select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .filter-actions {
      display: flex;
      gap: 10px;
      grid-column: 1 / -1;
      justify-content: flex-end;
      margin-top: 10px;
    }

    .clear-button {
      padding: 8px 16px;
      background-color: #9E9E9E;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .apply-button {
      padding: 8px 16px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
    }

    .report-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .report-card h2 {
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .summary-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #2196F3;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .chart-container {
      margin-bottom: 20px;
    }

    .chart-bar {
      margin-bottom: 10px;
    }

    .bar-label {
      margin-bottom: 5px;
    }

    .bar-container {
      display: flex;
      align-items: center;
      height: 25px;
    }

    .bar {
      height: 100%;
      min-width: 5px;
      border-radius: 4px;
    }

    .bar-value {
      margin-left: 10px;
      font-weight: bold;
    }

    .movement-receipt {
      background-color: #4CAF50;
    }

    .movement-sale {
      background-color: #2196F3;
    }

    .movement-transfer {
      background-color: #FF9800;
    }

    .movement-return {
      background-color: #9C27B0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f8f8;
      font-weight: bold;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  `]
})
export class ReportsDashboardComponent implements OnInit {
  inventoryReport: InventoryReport | null = null;
  movementReport: MovementReport | null = null;
  filters: ReportFilter = {};
  categories: { id: number, name: string }[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadReports();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.results.map(category => ({
          id: category.id,
          name: category.name
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadReports(): void {
    this.apiService.getInventoryReport(this.filters).subscribe({
      next: (report) => {
        this.inventoryReport = report;
      },
      error: (error) => {
        console.error('Error loading inventory report:', error);
      }
    });

    this.apiService.getMovementReport(this.filters).subscribe({
      next: (report) => {
        this.movementReport = report;
      },
      error: (error) => {
        console.error('Error loading movement report:', error);
      }
    });
  }

  applyFilters(): void {
    this.loadReports();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadReports();
  }

  formatCurrency(value: number | undefined | null): string {
    if (value === undefined || value === null) {
      return '$0.00';
    }
    return `$${value.toFixed(2)}`;
  }

  getMovementTypeLabel(type: string): string {
    switch (type) {
      case 'writeoff': return 'Write-off';
      case 'receipt': return 'Receipt';
      case 'transfer': return 'Transfer';
      default: return type;
    }
  }

  getMovementTypePercentage(count: number): number {
    if (!this.movementReport || !this.movementReport.movements_by_type) {
      return 0;
    }
    
    const total = this.movementReport.movements_by_type.reduce((sum, type) => sum + type.count, 0);
    if (total === 0) {
      return 0;
    }
    
    return (count / total) * 100;
  }
} 