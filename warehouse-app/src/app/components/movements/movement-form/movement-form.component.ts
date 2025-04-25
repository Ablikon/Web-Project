import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { MovementService } from '../../../services/movement.service';
import { ProductItemService } from '../../../services/product-item.service';
import { forkJoin } from 'rxjs';
import { Product, ProductItem, ProductMovement } from '../../../models/product.interface';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.scss']
})
export class MovementFormComponent implements OnInit {
  movementForm: FormGroup;
  isEditMode = false;
  movementId: number | null = null;
  products: Product[] = [];
  productItems: ProductItem[] = [];
  filteredProductItems: ProductItem[] = [];
  movementTypes = [
    { value: 'receipt', label: 'Receipt (Incoming)' },
    { value: 'writeoff', label: 'Write-off (Outgoing)' },
    { value: 'transfer', label: 'Transfer' }
  ];
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productItemService: ProductItemService,
    private movementService: MovementService
  ) {
    this.movementForm = this.fb.group({
      product: [null, Validators.required],
      productItem: [null, Validators.required],
      movementType: ['receipt', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadFormData();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.movementId = +id;
      this.loadMovementData(+id);
    }

    // Filter product items when product changes
    this.movementForm.get('product')?.valueChanges.subscribe(productId => {
      if (productId) {
        this.filteredProductItems = this.productItems.filter(item => {
          // Handle cases where product could be an object or just an ID
          const itemProductId = typeof item.product === 'number' ? item.product : item.product.id;
          return itemProductId === productId;
        });
      } else {
        this.filteredProductItems = [];
      }
      this.movementForm.get('productItem')?.setValue(null);
    });
  }

  loadFormData(): void {
    this.isLoading = true;
    forkJoin({
      products: this.productService.getProducts(),
      productItems: this.productItemService.getProductItems()
    }).subscribe({
      next: (data) => {
        this.products = data.products.results || [];
        this.productItems = data.productItems.results || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        alert('Failed to load form data. Please try again.');
        this.isLoading = false;
      }
    });
  }

  loadMovementData(id: number): void {
    this.isLoading = true;
    this.movementService.getMovement(id).subscribe({
      next: (movement: ProductMovement) => {
        // First set the product to filter product items correctly
        const productItem = typeof movement.product_item === 'number' 
          ? this.productItems.find(item => item.id === movement.product_item)
          : movement.product_item;
          
        if (productItem) {
          const productId = typeof productItem.product === 'number' 
            ? productItem.product 
            : productItem.product.id;
            
          this.movementForm.get('product')?.setValue(productId);
          
          this.movementForm.patchValue({
            productItem: productItem.id,
            movementType: movement.movement_type,
            quantity: movement.quantity,
            price: movement.price
          });
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movement:', error);
        alert('Failed to load movement data. Please try again.');
        this.isLoading = false;
        this.router.navigate(['/movements']);
      }
    });
  }

  onSubmit(): void {
    if (this.movementForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.movementForm.controls).forEach(key => {
        const control = this.movementForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.movementForm.value;
    const movementData = {
      product_item: formValues.productItem,
      movement_type: formValues.movementType,
      quantity: formValues.quantity,
      price: formValues.price
    };

    this.isLoading = true;

    if (this.isEditMode && this.movementId) {
      this.movementService.updateMovement(this.movementId, movementData).subscribe({
        next: () => {
          alert('Movement updated successfully!');
          this.isLoading = false;
          this.router.navigate(['/movements']);
        },
        error: (error) => {
          console.error('Error updating movement:', error);
          alert('Failed to update movement. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.movementService.createMovement(movementData).subscribe({
        next: () => {
          alert('Movement created successfully!');
          this.isLoading = false;
          this.router.navigate(['/movements']);
        },
        error: (error) => {
          console.error('Error creating movement:', error);
          alert('Failed to create movement. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/movements']);
  }
} 