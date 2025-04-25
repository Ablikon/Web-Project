import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="app-logo">
          <span class="app-icon">
            <i class="fas fa-warehouse"></i>
          </span>
          <span class="app-name">WareHouse</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/products" routerLinkActive="active">
              <i class="fas fa-box"></i>
              <span>Products</span>
            </a>
          </li>
          <li>
            <a routerLink="/categories" routerLinkActive="active">
              <i class="fas fa-tags"></i>
              <span>Categories</span>
            </a>
          </li>
          <li>
            <a routerLink="/inventory" routerLinkActive="active">
              <i class="fas fa-clipboard-list"></i>
              <span>Inventory</span>
            </a>
          </li>
          <li>
            <a routerLink="/movements" routerLinkActive="active">
              <i class="fas fa-exchange-alt"></i>
              <span>Movements</span>
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="active">
              <i class="fas fa-chart-bar"></i>
              <span>Reports</span>
            </a>
          </li>
          <li class="logout-item">
            <a (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      background-color: #1a2a46;
      color: white;
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 20px 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: bold;
    }

    .app-icon {
      color: #4CAF50;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .sidebar-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-nav li {
      margin-bottom: 5px;
    }

    .sidebar-nav li a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      color: #b4c2d3;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
    }

    .sidebar-nav li a:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .sidebar-nav li a.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      font-weight: bold;
      border-left: 3px solid #4CAF50;
    }

    .sidebar-nav li a i {
      width: 20px;
      text-align: center;
      font-size: 16px;
    }

    .logout-item {
      margin-top: auto;
    }

    .logout-item a {
      color: #f44336 !important;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 