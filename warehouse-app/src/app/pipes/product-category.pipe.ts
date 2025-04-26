import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/product.interface';

@Pipe({
  name: 'productCategory',
  standalone: true
})
export class ProductCategoryPipe implements PipeTransform {
  transform(value: number | Category): Category | null {
    if (!value) {
      return null;
    }
    
    if (typeof value === 'number') {
      // It's just an ID, we can't show category details
      return null;
    }
    
    // It's a Category object
    return value;
  }
}
