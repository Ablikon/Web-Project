import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <div class="sidebar-container">
        <app-sidebar></app-sidebar>
      </div>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      width: 100%;
    }

    .sidebar-container {
      width: 240px;
      flex-shrink: 0;
      background-color: #1a2a46;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #f8f9fa;
    }

    @media (max-width: 768px) {
      .sidebar-container {
        width: 60px;
      }
    }
  `]
})
export class LayoutComponent {
} 