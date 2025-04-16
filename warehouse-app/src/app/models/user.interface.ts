export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'storekeeper';
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'storekeeper';
  first_name?: string;
  last_name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
} 