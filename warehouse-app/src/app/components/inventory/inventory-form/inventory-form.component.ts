import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product, ProductItem } from '../../../models/product.interface';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="inventory-form-container">
      <div class="header">
        <h1>Add Inventory Item</h1>
      </div>
      
      <div class="form-container">
        <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="product">Product</label>
            <select id="product" formControlName="product" class="form-control">
              <option value="">-- Select Product --</option>
              <option *ngFor="let product of products" [value]="product.id">
                {{ product.name }} ({{ product.unit }})
              </option>
            </select>
            <div class="error" *ngIf="submitted && f['product'].errors">
              Product is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="quantity">Initial Quantity</label>
            <input type="number" id="quantity" formControlName="quantity" class="form-control" />
            <div class="error" *ngIf="submitted && f['quantity'].errors">
              <span *ngIf="f['quantity'].errors?.['required']">Quantity is required</span>
              <span *ngIf="f['quantity'].errors?.['min']">Quantity must be greater than or equal to 0</span>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn secondary" routerLink="/inventory">Cancel</button>
            <button type="submit" class="btn primary">Add to Inventory</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .inventory-form-container {
      padding: 20px;
    }
    
    .header {
      margin-bottom: 20px;
    }
    
    .form-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 600px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }
    
    .btn {
      padding: 10px 20px;
      border-radius: 4px;
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
  `
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  products: Product[] = [];
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.inventoryForm = this.fb.group({
      product: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
  
  // Getter for easy access to form fields
  get f() { 
    return this.inventoryForm.controls; 
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.inventoryForm.invalid) {
      return;
    }
    
    const newItem: ProductItem = {
      id: 0, // Will be assigned by the backend
      product: Number(this.inventoryForm.value.product),
      quantity: this.inventoryForm.value.quantity
    };
    
    this.productService.createProductItem(newItem).subscribe(
      () => {
        this.router.navigate(['/inventory']);
      },
      error => {
        console.error('Error creating inventory item:', error);
      }
    );
  }
} 