import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductItem, Product, ProductMovement } from '../../../models/product.interface';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="movement-container">
      <div class="header">
        <h1>Record Product Movement</h1>
      </div>
      
      <div class="form-container">
        <form [formGroup]="movementForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="movement_type">Movement Type</label>
            <select id="movement_type" formControlName="movement_type" class="form-control">
              <option value="">-- Select Movement Type --</option>
              <option value="receipt">Receipt (Add to Inventory)</option>
              <option value="writeoff">Write-off (Remove from Inventory)</option>
              <option value="transfer">Transfer</option>
            </select>
            <div class="error" *ngIf="submitted && f['movement_type'].errors">
              Movement type is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="product_item">Product</label>
            <select id="product_item" formControlName="product_item" class="form-control">
              <option value="">-- Select Product --</option>
              <option *ngFor="let item of productItems" [value]="item.id">
                {{ getProductName(item) }} - {{ item.quantity }} {{ getProductUnit(item) }}
              </option>
            </select>
            <div class="error" *ngIf="submitted && f['product_item'].errors">
              Product is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" formControlName="quantity" class="form-control" />
            <div class="error" *ngIf="submitted && f['quantity'].errors">
              <span *ngIf="f['quantity'].errors?.['required']">Quantity is required</span>
              <span *ngIf="f['quantity'].errors?.['min']">Quantity must be greater than 0</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="price">Unit Price</label>
            <input type="number" id="price" formControlName="price" class="form-control" />
            <div class="error" *ngIf="submitted && f['price'].errors">
              <span *ngIf="f['price'].errors?.['required']">Price is required</span>
              <span *ngIf="f['price'].errors?.['min']">Price must be greater than or equal to 0</span>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn secondary" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn primary">Record Movement</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .movement-container {
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
export class MovementFormComponent implements OnInit {
  movementForm: FormGroup;
  productItems: ProductItem[] = [];
  submitted = false;
  selectedProductItem?: ProductItem;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.movementForm = this.fb.group({
      movement_type: ['', Validators.required],
      product_item: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.1)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit(): void {
    this.loadProductItems();
    
    // Check if there's a product ID in the query params
    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.movementForm.patchValue({
          product_item: params['productId']
        });
      }
    });
  }
  
  loadProductItems(): void {
    this.productService.getProductItems().subscribe(items => {
      this.productItems = items;
    });
  }
  
  // Getter for easy access to form fields
  get f() { 
    return this.movementForm.controls; 
  }
  
  getProductName(item: ProductItem): string {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.name;
    }
    return 'Unknown Product';
  }
  
  getProductUnit(item: ProductItem): string {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product.unit;
    }
    return '';
  }
  
  updateSelectedProduct(): void {
    const productItemId = this.movementForm.get('product_item')?.value;
    this.selectedProductItem = this.productItems.find(item => item.id.toString() === productItemId);
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.movementForm.invalid) {
      return;
    }
    
    this.updateSelectedProduct();
    
    if (!this.selectedProductItem) {
      return;
    }
    
    const movement: Partial<ProductMovement> = {
      movement_type: this.movementForm.value.movement_type,
      product_item: this.movementForm.value.product_item,
      quantity: this.movementForm.value.quantity,
      price: this.movementForm.value.price,
      // The backend will calculate previous_quantity and new_quantity
      previous_quantity: this.selectedProductItem.quantity,
      new_quantity: this.calculateNewQuantity(
        this.selectedProductItem.quantity, 
        this.movementForm.value.quantity, 
        this.movementForm.value.movement_type
      )
    };
    
    this.productService.createProductMovement(movement as ProductMovement).subscribe(
      () => {
        this.router.navigate(['/movements']);
      },
      error => {
        console.error('Error creating movement:', error);
      }
    );
  }
  
  calculateNewQuantity(currentQty: number, movementQty: number, movementType: string): number {
    switch (movementType) {
      case 'receipt':
        return currentQty + movementQty;
      case 'writeoff':
        return Math.max(0, currentQty - movementQty);
      default:
        return currentQty; // For transfer or other types
    }
  }
  
  goBack(): void {
    this.router.navigate(['/inventory']);
  }
} 