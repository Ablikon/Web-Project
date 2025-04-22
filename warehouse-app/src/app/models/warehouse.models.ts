export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: number; // Category ID
  category_details?: Category; // Populated by the API when needed
}

export interface ProductItem {
  id: number;
  product: number; // Product ID
  product_details?: Product; // Populated by the API when needed
  serial_number?: string;
  status: 'in_stock' | 'sold' | 'reserved' | 'defective';
  purchase_date: string; // ISO date string
  purchase_price?: number;
  location?: string;
  notes?: string;
}

export interface ProductMovement {
  id: number;
  product_item: number; // ProductItem ID
  product_item_details?: ProductItem; // Populated by the API when needed
  date: string; // ISO date string
  movement_type: 'receipt' | 'sale' | 'transfer' | 'return';
  quantity: number;
  location_from?: string;
  location_to?: string;
  notes?: string;
  created_by: number; // User ID
  created_by_details?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  }; // Populated by the API when needed
}

// Simplified response interfaces for API calls
export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ErrorResponse {
  detail?: string;
  [key: string]: any; // For field-specific errors
} 