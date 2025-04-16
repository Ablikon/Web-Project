import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-card">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact an administrator if you believe this is an error.</p>
        <a routerLink="/dashboard" class="btn">Return to Dashboard</a>
      </div>
    </div>
  `,
  styles: `
    .access-denied-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }
    
    .access-denied-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 40px;
      max-width: 500px;
      text-align: center;
    }
    
    .icon {
      color: #e53935;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 8px;
    }
    
    .btn {
      display: inline-block;
      margin-top: 24px;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: #1565c0;
    }
  `
})
export class AccessDeniedComponent {} 