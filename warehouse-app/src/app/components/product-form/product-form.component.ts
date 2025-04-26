import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models/product.interface';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, WarehouseLayoutComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    unit: '',
    category: 0
  };
  
  categories: Category[] = [];
  isEditMode = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load categories
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productService.getProduct(+id).subscribe(product => {
        this.product = {
          ...product,
          // Ensure category is always a number
          category: typeof product.category === 'number' ? 
            product.category : 
            product.category.id
        };
      });
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      // Set default category if we have categories and product doesn't have one set
      if (this.categories.length > 0 && this.product.category === 0) {
        this.product.category = this.categories[0].id;
      }
    });
  }

  isFormValid(): boolean {
    return !!this.product.name && 
           !!this.product.unit && 
           !!this.product.category;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }
    
    // Prepare the product data for submission
    const productData = {
      ...this.product,
      // Ensure category is sent as a number
      category: typeof this.product.category === 'number' ? 
        this.product.category : 
        (this.product.category as Category).id
    };
    
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, productData).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          // Handle error appropriately
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          // Handle error appropriately
        }
      });
    }
  }
} 