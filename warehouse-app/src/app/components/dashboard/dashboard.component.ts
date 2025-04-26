import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductItemService } from '../../services/product-item.service';
import { ProductMovementService } from '../../services/product-movement.service';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WarehouseLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalInventoryItems: number = 0;
  recentMovements: number = 0;
  loading: boolean = true;
  error: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private productItemService: ProductItemService,
    private movementService: ProductMovementService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Загрузка количества продуктов
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading products: ' + err.message;
        this.loading = false;
      }
    });

    // Загрузка количества категорий
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
      },
      error: (err) => {
        this.error = 'Error loading categories: ' + err.message;
      }
    });

    // Загрузка количества товаров в инвентаре
    this.productItemService.getProductItems().subscribe({
      next: (items) => {
        this.totalInventoryItems = items.length;
      },
      error: (err) => {
        this.error = 'Error loading inventory items: ' + err.message;
      }
    });

    // Загрузка количества недавних движений
    this.movementService.getProductMovements().subscribe({
      next: (movements) => {
        this.recentMovements = movements.length;
      },
      error: (err) => {
        this.error = 'Error loading movements: ' + err.message;
      }
    });
  }
} 