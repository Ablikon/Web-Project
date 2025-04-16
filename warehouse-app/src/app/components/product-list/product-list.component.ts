import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
    }
  }

  getCategoryName(categoryId: number | Category): string {
    if (typeof categoryId === 'object' && categoryId !== null) {
      return categoryId.name;
    } else {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    }
  }

  get filteredProducts() {
    if (!this.searchTerm) {
      return this.products;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      this.getCategoryName(product.category).toLowerCase().includes(term)
    );
  }
} 