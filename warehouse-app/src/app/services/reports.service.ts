import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { ProductItemService } from './product-item.service';
import { CategoryService } from './category.service';
import { Product, ProductItem, Category } from '../models/product.interface';
import * as XLSX from 'xlsx';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(
    private productService: ProductService,
    private productItemService: ProductItemService,
    private categoryService: CategoryService
  ) {}

  private getProductStock(productId: number, productItems: ProductItem[]): number {
    const items = productItems.filter(item => {
      if (typeof item.product === 'number') {
        return item.product === productId;
      } else {
        return item.product.id === productId;
      }
    });
    return items.reduce((total, item) => total + Number(item.quantity), 0);
  }

  private getCategoryName(categoryId: number | Category): string {
    if (typeof categoryId === 'number') {
      return `Category ${categoryId}`;
    }
    return categoryId.name;
  }

  async generateProductReport(): Promise<void> {
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      const productItems = await firstValueFrom(this.productItemService.getProductItems());
      
      // Prepare data for Excel
      const data = products.map(product => ({
        'ID': product.id,
        'Название': product.name,
        'Категория': this.getCategoryName(product.category),
        'Единица измерения': product.unit,
        'Количество': this.getProductStock(product.id, productItems)
      }));

      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Продукты');

      // Generate Excel file
      XLSX.writeFile(wb, 'products-report.xlsx');
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async generateInventoryReport(): Promise<void> {
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      const productItems = await firstValueFrom(this.productItemService.getProductItems());
      
      // Prepare data for Excel with inventory focus
      const data = products.map(product => {
        const stock = this.getProductStock(product.id, productItems);
        return {
          'ID': product.id,
          'Название продукта': product.name,
          'Категория': this.getCategoryName(product.category),
          'Единица измерения': product.unit,
          'Текущий запас': stock,
          'Статус': this.getStockStatus(stock)
        };
      });

      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Инвентарь');

      // Generate Excel file
      XLSX.writeFile(wb, 'inventory-report.xlsx');
    } catch (error) {
      console.error('Error generating inventory report:', error);
      throw error;
    }
  }

  private getStockStatus(stock: number): string {
    if (stock <= 0) return 'Нет в наличии';
    if (stock < 10) return 'Низкий запас';
    if (stock < 50) return 'Средний запас';
    return 'Достаточный запас';
  }
} 