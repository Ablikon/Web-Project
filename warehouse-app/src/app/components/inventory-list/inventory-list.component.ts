import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ProductCategoryPipe } from '../../pipes/product-category.pipe';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WarehouseLayoutComponent, ProductCategoryPipe],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngDoCheck(): void {
    // Фильтрация при изменении поискового запроса
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.unit.toLowerCase().includes(term)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading products: ' + err.message;
        this.loading = false;
      }
    });
  }
}
