import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMovementService } from '../../services/product-movement.service';
import { ProductMovement } from '../../models/product.interface';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, WarehouseLayoutComponent],
  templateUrl: './movement-list.component.html',
  styleUrls: ['./movement-list.component.scss']
})
export class MovementListComponent implements OnInit {
  movements: ProductMovement[] = [];
  loading = false;
  error: string | null = null;

  constructor(private movementService: ProductMovementService) { }

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.loading = true;
    this.error = null;
    
    this.movementService.getProductMovements().subscribe({
      next: (data: ProductMovement[]) => {
        this.movements = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load movements. Please try again.';
        this.loading = false;
        console.error('Error loading movements:', err);
      }
    });
  }
}
