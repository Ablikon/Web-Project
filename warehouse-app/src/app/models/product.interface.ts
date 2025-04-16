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

export interface InventoryAlert {
  id: number;
  product_item: ProductItem;
  alert_type: 'low_stock';
  threshold: number;
  is_active: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  low_stock_items: number;
  recent_movements: ProductMovement[];
  top_categories: {
    category: Category;
    count: number;
  }[];
} 