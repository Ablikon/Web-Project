import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductItemService } from '../../../services/product-item.service';
import { Product } from '../../../models/product.interface';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  products: Product[] = [];
  inventoryItem: any = {
    product: null,
    quantity: 1
  };
  isEditMode = false;

  constructor(
    private productService: ProductService,
    private productItemService: ProductItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadInventoryItem(+id);
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.results || [];
        // Set default product if none selected
        if (this.products.length > 0 && !this.inventoryItem.product) {
          this.inventoryItem.product = this.products[0].id;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadInventoryItem(id: number): void {
    this.productItemService.getProductItem(id).subscribe({
      next: (item) => {
        this.inventoryItem = {
          id: item.id,
          product: item.product,
          quantity: item.quantity
        };
      },
      error: (error) => {
        console.error('Error loading inventory item:', error);
        this.router.navigate(['/inventory']);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.productItemService.updateProductItem(this.inventoryItem.id, this.inventoryItem).subscribe({
        next: () => {
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          console.error('Error updating inventory item:', error);
        }
      });
    } else {
      this.productItemService.createProductItem(this.inventoryItem).subscribe({
        next: () => {
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          console.error('Error creating inventory item:', error);
        }
      });
    }
  }
} 