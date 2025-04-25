export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: number;
  category_details?: Category;
}

export interface ProductItem {
  id: number;
  product: number;
  product_details?: Product;
  quantity: number;
}

export interface ProductMovement {
  id: number;
  product_item: number;
  product_item_details?: ProductItem;
  movement_type: 'writeoff' | 'receipt' | 'transfer';
  previous_quantity: number;
  new_quantity: number;
  quantity: number;
  price: number;
  created_at: string;
  created_by: number | null;
  created_by_details?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface ReportFilter {
  start_date?: string;
  end_date?: string;
  category?: number;
  movement_type?: string;
}

export interface InventoryReport {
  total_value: number;
  total_items: number;
  items_by_category: {
    category: string;
    count: number;
    value: number;
  }[];
}

export interface MovementReport {
  movements_by_type: {
    type: string;
    count: number;
  }[];
  movements_by_date: {
    date: string;
    count: number;
  }[];
}

export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ErrorResponse {
  detail?: string;
  [key: string]: any;
} 