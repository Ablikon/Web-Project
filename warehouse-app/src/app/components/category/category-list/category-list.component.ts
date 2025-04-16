import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../models/product.interface';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="category-container">
      <div class="header">
        <h1>Categories</h1>
        <button class="btn primary" (click)="openCategoryForm()">Add Category</button>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search categories..." 
          class="search-input"
        />
      </div>
      
      <div class="category-form" *ngIf="isFormVisible">
        <form (ngSubmit)="saveCategory()">
          <input 
            type="text" 
            [(ngModel)]="newCategory.name" 
            name="name"
            placeholder="Category name" 
            required
          />
          <div class="form-actions">
            <button type="button" class="btn secondary" (click)="cancelForm()">Cancel</button>
            <button type="submit" class="btn primary">Save</button>
          </div>
        </form>
      </div>
      
      <div class="category-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of filteredCategories">
              <td>{{ category.name }}</td>
              <td class="actions">
                <button class="btn-icon" (click)="editCategory(category)">Edit</button>
                <button class="btn-icon delete" (click)="deleteCategory(category.id)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredCategories.length === 0">
              <td colspan="2" class="empty-state">No categories found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .category-container {
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
      border: none;
    }
    
    .primary {
      background-color: #1976d2;
      color: white;
    }
    
    .secondary {
      background-color: #e0e0e0;
      color: #333;
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
    
    .category-form {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .category-form form {
      display: flex;
      gap: 10px;
    }
    
    .category-form input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
    }
    
    .category-list {
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
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  searchTerm = '';
  isFormVisible = false;
  isEditMode = false;
  newCategory: Category = { id: 0, name: '' };
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.productService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    );
  }
  
  get filteredCategories(): Category[] {
    if (!this.searchTerm) {
      return this.categories;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.categories.filter(category => 
      category.name.toLowerCase().includes(term)
    );
  }
  
  openCategoryForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.newCategory = { id: 0, name: '' };
  }
  
  cancelForm(): void {
    this.isFormVisible = false;
    this.newCategory = { id: 0, name: '' };
  }
  
  editCategory(category: Category): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.newCategory = { ...category };
  }
  
  saveCategory(): void {
    if (!this.newCategory.name.trim()) {
      return;
    }
    
    if (this.isEditMode) {
      this.productService.updateCategory(this.newCategory.id, this.newCategory).subscribe(
        () => {
          this.loadCategories();
          this.cancelForm();
        }
      );
    } else {
      this.productService.createCategory(this.newCategory).subscribe(
        () => {
          this.loadCategories();
          this.cancelForm();
        }
      );
    }
  }
  
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.productService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
        }
      );
    }
  }
} 