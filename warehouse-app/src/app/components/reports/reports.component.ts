import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models/product.interface';
import { ProductCategoryPipe } from '../../pipes/product-category.pipe';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

interface CategoryReport {
  category: Category;
  productCount: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ProductCategoryPipe, WarehouseLayoutComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  categoryReports: CategoryReport[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        
        this.categoryService.getCategories().subscribe({
          next: (categories) => {
            this.categories = categories;
            this.generateCategoryReports();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load categories';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  generateCategoryReports(): void {
    this.categoryReports = this.categories.map(category => {
      const categoryProducts = this.products.filter(product => {
        if (typeof product.category === 'number') {
          return product.category === category.id;
        } else {
          return product.category.id === category.id;
        }
      });
      
      return {
        category,
        productCount: categoryProducts.length
      };
    });
  }
}
