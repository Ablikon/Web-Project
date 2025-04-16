import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="reports-container">
      <h1>Reports</h1>
      
      <div class="report-section">
        <h2>Current Inventory Report</h2>
        <p>Generate a comprehensive report of the current inventory status including all products, quantities, and values.</p>
        <button class="btn primary" (click)="generateInventoryReport()">Generate Inventory Report</button>
      </div>
      
      <div class="report-section">
        <h2>Product Movement Report</h2>
        <p>Generate a report of all product movements within a specific date range.</p>
        
        <form [formGroup]="dateRangeForm" class="date-form">
          <div class="form-group">
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate" formControlName="startDate" class="form-control">
          </div>
          
          <div class="form-group">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate" formControlName="endDate" class="form-control">
          </div>
          
          <button class="btn primary" (click)="generateMovementReport()">Generate Movement Report</button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .reports-container {
      padding: 20px;
    }
    
    .report-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    h1 {
      margin-bottom: 20px;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
    }
    
    p {
      color: #666;
      margin-bottom: 16px;
    }
    
    .date-form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      align-items: flex-end;
      margin-top: 20px;
    }
    
    .form-group {
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-control {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      border: none;
    }
    
    .primary {
      background-color: #1976d2;
      color: white;
    }
  `
})
export class ReportsComponent {
  dateRangeForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    // Initialize with the current month date range
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.dateRangeForm = this.fb.group({
      startDate: [this.formatDate(firstDay)],
      endDate: [this.formatDate(today)]
    });
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  generateInventoryReport(): void {
    this.productService.generateInventoryReport().subscribe(
      (blob: Blob) => {
        this.downloadFile(blob, `inventory-report-${this.formatDate(new Date())}.xlsx`);
      },
      error => {
        console.error('Error generating inventory report:', error);
        alert('An error occurred while generating the report. Please try again.');
      }
    );
  }
  
  generateMovementReport(): void {
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    
    this.productService.generateMovementReport(startDate, endDate).subscribe(
      (blob: Blob) => {
        this.downloadFile(blob, `movement-report-${startDate}-to-${endDate}.xlsx`);
      },
      error => {
        console.error('Error generating movement report:', error);
        alert('An error occurred while generating the report. Please try again.');
      }
    );
  }
  
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
} 