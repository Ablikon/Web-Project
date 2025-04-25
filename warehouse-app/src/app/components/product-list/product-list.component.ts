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

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
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
    private authService: AuthService
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
        this.products = data;
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
    this.productItemService.getProductItems().subscribe({
      next: (data) => {
        this.productItems = data;
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

  getCategory(categoryId: number | Category): string {
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
      product.unit.toLowerCase().includes(searchTermLower)
    );
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 