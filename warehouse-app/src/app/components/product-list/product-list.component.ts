import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductItemService } from '../../services/product-item.service';
import { ProductMovementService } from '../../services/product-movement.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category, ProductItem, ProductMovement } from '../../models/product.interface';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <h1>Products</h1>
        <div class="header-actions">
          <div class="search-container">
            <input 
              type="text" 
              placeholder="Search products..." 
              [(ngModel)]="searchTerm" 
              (input)="applyFilter()"
              class="search-input"
            >
            <i class="fas fa-search search-icon"></i>
          </div>
          <button class="add-button" [routerLink]="['/products/new']">
            <i class="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      <div class="stats-panel">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-boxes"></i>
          </div>
          <div class="stat-details">
            <h3>{{products.length}}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-details">
            <h3>{{categories.length}}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-dolly-flatbed"></i>
          </div>
          <div class="stat-details">
            <h3>{{totalStock}}</h3>
            <p>Items in Stock</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <div class="stat-details">
            <h3>{{movementsCount}}</h3>
            <p>Recent Movements</p>
          </div>
        </div>
      </div>

      <div class="products-grid" *ngIf="filteredProducts.length > 0; else noProducts">
        <div class="product-card" *ngFor="let product of filteredProducts">
          <div class="card-header">
            <h3>{{ product.name }}</h3>
            <span class="category-badge">{{ getCategoryName(product.category) || 'No Category' }}</span>
          </div>
          <div class="card-body">
            <p>{{ product.description || 'No description' }}</p>
          </div>
          <div class="card-footer">
            <button class="edit-button" [routerLink]="['/products/edit', product.id]">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-button" (click)="deleteProduct(product.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noProducts>
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-box"></i>
          </div>
          <p>No products found. Create a product to get started.</p>
          <button class="add-button" [routerLink]="['/products/new']">
            <i class="fas fa-plus"></i> Add Product
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

    .stats-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #4CAF50;
    }

    .stat-details h3 {
      font-size: 24px;
      margin: 0 0 5px 0;
      color: #333;
    }

    .stat-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: white;
      transition: transform 0.2s;
    }

    .product-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background-color: #f8f8f8;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .category-badge {
      background-color: #e0f2f1;
      color: #00796b;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  productItems: ProductItem[] = [];
  recentMovements: ProductMovement[] = [];
  searchTerm: string = '';
  totalStock: number = 0;
  movementsCount: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private productItemService: ProductItemService,
    private productMovementService: ProductMovementService,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadProductItems();
    this.loadRecentMovements();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.results || [];
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProductItems(): void {
    this.apiService.getInventory().subscribe({
      next: (data) => {
        this.productItems = data.results || [];
        this.calculateTotalStock();
      },
      error: (error) => {
        console.error('Error loading product items:', error);
      }
    });
  }

  loadRecentMovements(): void {
    this.productMovementService.getProductMovements().subscribe({
      next: (data) => {
        this.recentMovements = data;
        this.movementsCount = this.recentMovements.length;
      },
      error: (error) => {
        console.error('Error loading product movements:', error);
      }
    });
  }

  calculateTotalStock(): void {
    this.totalStock = this.productItems.reduce((total, item) => total + Number(item.quantity), 0);
  }

  getCategoryName(categoryId: number | Category): string {
    if (typeof categoryId === 'number') {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    } else {
      return categoryId.name;
    }
  }

  getProductStock(productId: number): number {
    const items = this.productItems.filter(item => {
      if (typeof item.product === 'number') {
        return item.product === productId;
      } else {
        return item.product.id === productId;
      }
    });
    
    return items.reduce((total, item) => total + Number(item.quantity), 0);
  }

  getStockClass(stock: number): string {
    if (stock <= 0) {
      return 'stock-danger';
    } else if (stock < 10) {
      return 'stock-warning';
    } else {
      return 'stock-good';
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTermLower) || 
      (product.description && product.description.toLowerCase().includes(searchTermLower))
    );
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 