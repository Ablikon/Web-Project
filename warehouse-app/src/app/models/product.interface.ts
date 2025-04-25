export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  unit: string;
  category: number | Category;
}

export interface ProductItem {
  id: number;
  product: number | Product;
  quantity: number;
}

export interface ProductMovement {
  id: number;
  movement_type: 'writeoff' | 'receipt' | 'transfer';
  product_item: number | ProductItem;
  previous_quantity: number;
  new_quantity: number;
  quantity: number;
  price: number;
  created_at: string;
  created_by: number | null;
} 