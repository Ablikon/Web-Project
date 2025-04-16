import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="user-container">
      <div class="header">
        <h1>User Management</h1>
        <a routerLink="/users/new" class="btn primary">Create User</a>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search users..." 
          class="search-input"
        />
      </div>
      
      <div class="user-list">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [ngClass]="user.role">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td class="actions">
                <a [routerLink]="['/users/edit', user.id]" class="btn-icon">Edit</a>
                <button class="btn-icon delete" (click)="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredUsers.length === 0">
              <td colspan="4" class="empty-state">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .user-container {
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
    
    .search-bar {
      margin-bottom: 20px;
    }
    
    .search-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
    }
    
    .user-list {
      background-color: white;
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
    
    .role-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .admin {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .manager {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .storekeeper {
      background-color: #fff8e1;
      color: #f57f17;
    }
    
    .actions {
      display: flex;
      gap: 10px;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: #1976d2;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
    }
    
    .delete {
      color: #d32f2f;
    }
    
    .empty-state {
      text-align: center;
      padding: 20px;
      color: #757575;
    }
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.authService.getUsers().subscribe(
      users => {
        this.users = users;
      }
    );
  }
  
  get filteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.users;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }
  
  formatRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }
  
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(
        () => {
          this.loadUsers();
        }
      );
    }
  }
} 