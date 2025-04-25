import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Category } from '../../../models/warehouse.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Categories</h1>
        <div class="header-actions">
          <div class="search-container">
            <input 
              type="text" 
              placeholder="Search categories..." 
              [(ngModel)]="searchTerm" 
              (input)="filterCategories()"
              class="search-input"
            >
            <i class="fas fa-search search-icon"></i>
          </div>
          <button class="add-button" [routerLink]="['/categories/new']">
            <i class="fas fa-plus"></i> Add Category
          </button>
        </div>
      </div>

      <div class="categories-grid" *ngIf="filteredCategories.length > 0; else noCategories">
        <div class="category-card" *ngFor="let category of filteredCategories">
          <div class="card-header">
            <h3>{{ category.name }}</h3>
          </div>
          <div class="card-body">
            <p>{{ category.description || 'No description' }}</p>
          </div>
          <div class="card-footer">
            <button class="edit-button" [routerLink]="['/categories/edit', category.id]">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-button" (click)="deleteCategory(category.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noCategories>
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-tags"></i>
          </div>
          <p>No categories found. Create a category to get started.</p>
          <button class="add-button" [routerLink]="['/categories/new']">
            <i class="fas fa-plus"></i> Add Category
          </button>
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
      flex-wrap: wrap;
      gap: 15px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .search-container {
      position: relative;
    }

    .search-input {
      padding: 10px 15px 10px 35px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 250px;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #888;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .category-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: white;
      transition: transform 0.2s;
    }

    .category-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background-color: #f8f8f8;
      padding: 15px;
      border-bottom: 1px solid #ddd;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .card-body {
      padding: 15px;
      min-height: 80px;
      color: #666;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-top: 1px solid #ddd;
    }

    .add-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background-color: #3e9142;
    }

    .edit-button {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .edit-button:hover {
      background-color: #0e87e3;
    }

    .delete-button {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .delete-button:hover {
      background-color: #e53c30;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      background-color: #f8f8f8;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .empty-icon {
      font-size: 50px;
      color: #ccc;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .search-input {
        width: 100%;
      }
    }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.results;
        this.filteredCategories = [...this.categories];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(search) || 
      (category.description && category.description.toLowerCase().includes(search))
    );
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(category => category.id !== id);
          this.filterCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }
} 