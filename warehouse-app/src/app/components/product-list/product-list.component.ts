import { Component, OnInit, Pipe, PipeTransform, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductItemService } from '../../services/product-item.service';
import { ProductMovementService } from '../../services/product-movement.service';
import { ToastService } from '../../services/toast.service';
import { Product, Category, ProductItem, ProductMovement } from '../../models/product.interface';
import { WarehouseLayoutComponent } from '../../layouts/warehouse-layout/warehouse-layout.component';

// Интерфейс для отображения движений в шаблоне
interface DisplayMovement {
  id: number;
  date: string;
  product: number | { id: number, name: string };
  type: 'IN' | 'OUT';
  quantity: number;
  price: number;
}

// Pipe для фильтрации
@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string | string[], value: any): any[] {
    if (!items) return [];
    if (!field || value === undefined) return items;
    
    if (Array.isArray(field)) {
      const [fieldName, fieldValue] = field;
      return items.filter(item => item[fieldName] === fieldValue);
    }
    
    return items.filter(item => item[field] === value);
  }
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, WarehouseLayoutComponent, FilterPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  productItems: ProductItem[] = [];
  recentMovements: DisplayMovement[] = [];
  searchTerm: string = '';
  totalStock: number = 0;
  movementsCount: number = 0;
  
  // Метод для проверки типа
  getTypeOf(value: any): string {
    return typeof value;
  }
  
  // Modal state variables
  showAddStockModal: boolean = false;
  showRemoveStockModal: boolean = false;
  selectedProduct: Product | null = null;
  stockQuantity: number = 1;
  stockPrice: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private productItemService: ProductItemService,
    private productMovementService: ProductMovementService,
    private toastService: ToastService
  ) { 
    // Закрываем модальные окна при создании компонента
    this.showAddStockModal = false;
    this.showRemoveStockModal = false;
    this.selectedProduct = null;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadInventory();
    this.loadMovements();
  }
  
  ngAfterViewInit(): void {
    // После инициализации представления, убедимся что модальные окна закрыты
    setTimeout(() => {
      this.closeModals();
    }, 100);
  }

  // Преобразует ProductMovement в DisplayMovement
  mapMovementToDisplay(movement: ProductMovement): DisplayMovement {
    // Определяем тип движения
    const type = movement.movement_type === 'receipt' ? 'IN' : 'OUT';
    
    // Получаем продукт из product_item
    let product: number | { id: number, name: string };
    if (typeof movement.product_item === 'number') {
      // Пытаемся найти productItem
      const productItem = this.productItems.find(item => item.id === movement.product_item);
      if (productItem) {
        if (typeof productItem.product === 'number') {
          product = productItem.product;
        } else {
          product = { id: productItem.product.id, name: productItem.product.name };
        }
      } else {
        // Если не можем найти, используем ID
        product = movement.product_item;
      }
    } else {
      // productItem доступен как объект
      if (typeof movement.product_item.product === 'number') {
        product = movement.product_item.product;
      } else {
        product = { id: movement.product_item.product.id, name: movement.product_item.product.name };
      }
    }
    
    return {
      id: movement.id,
      date: movement.created_at,
      product,
      type,
      quantity: movement.quantity,
      price: movement.price
    };
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadInventory(): void {
    this.productItemService.getProductItems().subscribe({
      next: (data: ProductItem[]) => {
        this.productItems = data;
        this.calculateTotalStock();
      },
      error: (error: any) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  loadMovements(): void {
    this.productMovementService.getProductMovements().subscribe({
      next: (data: ProductMovement[]) => {
        // Преобразуем движения в формат для отображения
        this.recentMovements = data.map(movement => this.mapMovementToDisplay(movement));
        this.movementsCount = data.length;
      },
      error: (error: any) => {
        console.error('Error loading movements:', error);
      }
    });
  }

  calculateTotalStock(): void {
    this.totalStock = this.productItems.reduce((total, item) => total + Number(item.quantity), 0);
  }

  getCategory(categoryId: number | Category): string {
    if (typeof categoryId === 'number') {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    } else {
      return categoryId.name;
    }
  }

  // Обновленный метод для получения имени продукта
  getProductName(productValue: number | { id: number, name: string }): string {
    if (typeof productValue === 'number') {
      const product = this.products.find(p => p.id === productValue);
      return product ? product.name : 'Unknown Product';
    } else {
      return productValue.name;
    }
  }

  getProductStock(productId: number): number {
    const items = this.productItems.filter(item => {
      if (typeof item.product === 'number') {
        return item.product === productId;
      } else {
        return item.product.id === productId;
      }
    });
    
    return items.reduce((total, item) => total + Number(item.quantity), 0);
  }

  getStockClass(stock: number): string {
    if (stock <= 0) {
      return 'stock-danger';
    } else if (stock < 10) {
      return 'stock-warning';
    } else {
      return 'stock-good';
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
          this.toastService.showSuccess('Product deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          this.toastService.showError('Failed to delete product. Please try again.');
        }
      });
    }
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTermLower) || 
      product.unit.toLowerCase().includes(searchTermLower)
    );
  }
  
  // Modal functions
  openAddStockModal(product: Product): void {
    if (!product) return;
    
    this.showRemoveStockModal = false;
    this.selectedProduct = product;
    this.stockQuantity = 1;
    this.stockPrice = 0;
    
    setTimeout(() => {
      this.showAddStockModal = true;
    }, 0);
  }
  
  openRemoveStockModal(product: Product): void {
    if (!product) return;
    
    this.showAddStockModal = false;
    this.selectedProduct = product;
    this.stockQuantity = 1;
    this.stockPrice = 0;
    
    setTimeout(() => {
      this.showRemoveStockModal = true;
    }, 0);
  }
  
  closeModals(): void {
    this.showAddStockModal = false;
    this.showRemoveStockModal = false;
    this.selectedProduct = null;
    this.stockQuantity = 1;
    this.stockPrice = 0;
  }
  
  addStock(): void {
    if (!this.selectedProduct || this.stockQuantity <= 0) {
      this.toastService.showWarning('Please specify a valid quantity');
      return;
    }
    
    try {
      // Create a new ProductItem
      const productItem = {
        product: this.selectedProduct.id,
        quantity: this.stockQuantity
      };
      
      this.productItemService.createProductItem(productItem).subscribe({
        next: (createdItem: ProductItem) => {
          // Create movement record
          this.productMovementService.addProductStock(
            createdItem.id,
            this.stockQuantity,
            this.stockPrice
          ).subscribe({
            next: () => {
              this.loadInventory();
              this.loadMovements();
              this.closeModals();
              this.toastService.showSuccess('Stock added successfully!');
            },
            error: (error: any) => {
              console.error('Error creating product movement:', error);
              
              // Try to clean up the created item since movement recording failed
              this.productItemService.deleteProductItem(createdItem.id).subscribe({
                next: () => {
                  this.toastService.showError('Failed to record stock movement. Operation cancelled.');
                },
                error: () => {
                  this.toastService.showError('Failed to record stock movement. Stock item was created but not properly recorded.');
                  this.loadInventory(); // Reload inventory to show the created item
                }
              });
            }
          });
        },
        error: (error: any) => {
          console.error('Error creating product item:', error);
          this.toastService.showError('Failed to add stock. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error in addStock:', error);
      this.toastService.showError('An unexpected error occurred. Please try again.');
    }
  }
  
  removeStock(): void {
    if (!this.selectedProduct || this.stockQuantity <= 0) {
      this.toastService.showWarning('Please specify a valid quantity');
      return;
    }
    
    const currentStock = this.getProductStock(this.selectedProduct.id);
    if (this.stockQuantity > currentStock) {
      this.toastService.showWarning(`You cannot remove more than the current stock (${currentStock})`);
      return;
    }
    
    try {
      // Find all product items for this product
      const productItems = this.productItems.filter(item => {
        if (typeof item.product === 'number') {
          return item.product === this.selectedProduct!.id;
        } else {
          return item.product.id === this.selectedProduct!.id;
        }
      });
      
      if (productItems.length === 0) {
        this.toastService.showError('No stock found for this product');
        return;
      }
      
      // Sort items by quantity (we'll use the items with more stock first)
      productItems.sort((a, b) => Number(b.quantity) - Number(a.quantity));
      
      // Use the first item with sufficient quantity
      const productItem = productItems.find(item => Number(item.quantity) >= this.stockQuantity);
      
      if (productItem) {
        // We found an item with enough quantity
        const updatedQuantity = Number(productItem.quantity) - this.stockQuantity;
        
        this.productItemService.updateProductItem(productItem.id, {
          quantity: updatedQuantity
        }).subscribe({
          next: () => {
            // Create movement record
            this.productMovementService.writeOffProductStock(
              productItem.id,
              this.stockQuantity,
              this.stockPrice
            ).subscribe({
              next: () => {
                this.loadInventory();
                this.loadMovements();
                this.closeModals();
                this.toastService.showSuccess('Stock removed successfully!');
              },
              error: (error: any) => {
                console.error('Error creating product movement:', error);
                this.toastService.showError('Failed to record stock movement. Please try again.');
              }
            });
          },
          error: (error: any) => {
            console.error('Error updating product item:', error);
            this.toastService.showError('Failed to update stock. Please try again.');
          }
        });
      } else {
        // We need to remove stock from multiple items
        let remainingQuantity = this.stockQuantity;
        let processedItems = 0;
        let successItems = 0;
        
        // Process each item until we've removed the requested quantity
        for (const item of productItems) {
          if (remainingQuantity <= 0) break;
          
          const quantityToRemove = Math.min(Number(item.quantity), remainingQuantity);
          const newQuantity = Number(item.quantity) - quantityToRemove;
          
          this.productItemService.updateProductItem(item.id, {
            quantity: newQuantity
          }).subscribe({
            next: () => {
              processedItems++;
              successItems++;
              
              // Create movement record for this item
              this.productMovementService.writeOffProductStock(
                item.id,
                quantityToRemove,
                this.stockPrice
              ).subscribe({
                next: () => {
                  // If this is the last item, reload data and close modal
                  if (processedItems === productItems.length || successItems >= productItems.length) {
                    this.loadInventory();
                    this.loadMovements();
                    this.closeModals();
                    this.toastService.showSuccess('Stock removed successfully!');
                  }
                },
                error: (error) => {
                  console.error('Error creating product movement:', error);
                  processedItems++;
                }
              });
              
              remainingQuantity -= quantityToRemove;
            },
            error: (error) => {
              console.error('Error updating product item:', error);
              processedItems++;
              
              // If all items have been processed, show feedback
              if (processedItems === productItems.length) {
                if (successItems > 0) {
                  this.loadInventory();
                  this.loadMovements();
                  this.toastService.showWarning('Partially removed stock. Some operations failed.');
                } else {
                  this.toastService.showError('Failed to remove stock. Please try again.');
                }
                this.closeModals();
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error in removeStock:', error);
      this.toastService.showError('An unexpected error occurred. Please try again.');
    }
  }
} 