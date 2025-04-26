import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.interface';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, WarehouseLayoutComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;
  error: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }
  
  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category. Please try again.';
        this.loading = false;
        console.error('Error loading category:', err);
      }
    });
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    
    const categoryData = this.categoryForm.value;
    this.loading = true;
    
    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Failed to update category. Please try again.';
          this.loading = false;
          console.error('Error updating category:', err);
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Failed to create category. Please try again.';
          this.loading = false;
          console.error('Error creating category:', err);
        }
      });
    }
  }
}
