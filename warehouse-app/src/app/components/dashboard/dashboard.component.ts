import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DashboardStats, InventoryAlert, ProductMovement } from '../../models/product.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="stats-cards">
        <div class="card">
          <h3>Total Products</h3>
          <p class="stat">{{ dashboardStats?.total_products || 0 }}</p>
        </div>
        <div class="card">
          <h3>Low Stock Items</h3>
          <p class="stat alert">{{ dashboardStats?.low_stock_items || 0 }}</p>
        </div>
      </div>
      
      <div class="section">
        <h2>Low Stock Alerts</h2>
        <div *ngIf="alerts.length === 0">No alerts at this time.</div>
        <div class="alerts" *ngIf="alerts.length > 0">
          <div class="alert-item" *ngFor="let alert of alerts">
            <span class="alert-title">{{ getProductNameFromItem(alert.product_item) }}</span>
            <span class="alert-qty">
              Current: {{ alert.product_item.quantity }} 
              (Threshold: {{ alert.threshold }})
            </span>
            <a routerLink="/inventory" class="btn">View Inventory</a>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Recent Movements</h2>
        <div *ngIf="recentMovements.length === 0">No recent movements.</div>
        <table *ngIf="recentMovements.length > 0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of recentMovements">
              <td>{{ getProductName(movement) }}</td>
              <td>{{ formatMovementType(movement.movement_type) }}</td>
              <td>{{ movement.quantity }}</td>
              <td>{{ movement.created_at | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container {
      padding: 20px;
    }
    
    .stats-cards {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      flex: 1;
    }
    
    .card h3 {
      margin-top: 0;
      color: #555;
      font-size: 16px;
    }
    
    .stat {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0 0;
    }
    
    .alert {
      color: #e53935;
    }
    
    .section {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .section h2 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    .alerts {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .alert-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #ffe8e8;
      border-radius: 4px;
    }
    
    .alert-title {
      font-weight: bold;
      flex: 1;
    }
    
    .alert-qty {
      margin: 0 20px;
    }
    
    .btn {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
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
      font-weight: 600;
      color: #555;
    }
  `
})
export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStats | null = null;
  alerts: InventoryAlert[] = [];
  recentMovements: ProductMovement[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.productService.getDashboardStats().subscribe(
      stats => {
        this.dashboardStats = stats;
        this.recentMovements = stats.recent_movements || [];
      }
    );

    this.productService.getLowStockAlerts().subscribe(
      alerts => {
        this.alerts = alerts;
      }
    );
  }

  getProductNameFromItem(productItem: any): string {
    if (productItem && typeof productItem.product === 'object' && productItem.product) {
      return productItem.product.name || 'Unnamed Product';
    }
    return 'Unknown Product';
  }

  getProductName(movement: ProductMovement): string {
    if (typeof movement.product_item === 'object' && movement.product_item !== null) {
      return this.getProductNameFromItem(movement.product_item);
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
} 