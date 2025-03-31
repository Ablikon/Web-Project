import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { Product } from '../models/product.interface';

// Вспомогательные функции для работы с localStorage
function getLocalStorageItem(key: string, defaultValue: string = '[]'): any {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(key) || defaultValue);
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return JSON.parse(defaultValue);
    }
  }
  return JSON.parse(defaultValue);
}

function setLocalStorageItem(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to set ${key} in localStorage`, e);
    }
  }
}

// Инициализация данных
let users: User[] = getLocalStorageItem('users');

// Добавляем тестового пользователя, если список пуст
if (users.length === 0) {
  users = [{ 
    id: 1, 
    username: 'admin', 
    email: 'admin@example.com', 
    role: 'admin' 
  }];
  setLocalStorageItem('users', users);
}

// Тестовые продукты
let products: Product[] = getLocalStorageItem('products');

// Добавляем тестовые продукты, если список пуст
if (products.length === 0) {
  products = [
    {
      id: 1,
      name: 'Laptop',
      description: 'High-performance laptop with 16GB RAM',
      quantity: 10,
      price: 1200,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Desk Chair',
      description: 'Ergonomic office chair with lumbar support',
      quantity: 15,
      price: 250,
      category: 'Furniture'
    },
    {
      id: 3,
      name: 'Smartphone',
      description: 'Latest model with 128GB storage',
      quantity: 20,
      price: 800,
      category: 'Electronics'
    }
  ];
  setLocalStorageItem('products', products);
}

// Интерцептор для моковых данных
export const mockBackendInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const { url, method, headers, body } = request;

  console.log(`Intercepted ${method} request to ${url}`);

  return of(null)
    .pipe(mergeMap(handleRoute))
    .pipe(materialize())
    .pipe(delay(200))
    .pipe(dematerialize());

  function handleRoute() {
    switch (true) {
      case url.endsWith('/api/auth/login'):
        console.log('Handling login request');
        return authenticate();
      case url.endsWith('/api/auth/register'):
        console.log('Handling register request');
        return register();
      case url.endsWith('/api/products') && method === 'GET':
        console.log('Handling get products request');
        return getProducts();
      case url.match(/\/api\/products\/\d+$/) && method === 'GET':
        console.log('Handling get product by id request');
        return getProductById();
      case url.endsWith('/api/products') && method === 'POST':
        console.log('Handling create product request');
        return createProduct();
      case url.match(/\/api\/products\/\d+$/) && method === 'PUT':
        console.log('Handling update product request');
        return updateProduct();
      case url.match(/\/api\/products\/\d+$/) && method === 'DELETE':
        console.log('Handling delete product request');
        return deleteProduct();
      default:
        console.log(`Passing through request to ${url}`);
        return next(request);
    }
  }

  // Обработчики маршрутов
  function authenticate() {
    const { username, password } = body;
    // Условный пароль для всех пользователей
    const mockPassword = 'password';
    const user = users.find(x => x.username === username);
    
    if (!user || password !== mockPassword) {
      return error('Username or password is incorrect');
    }
    
    return ok({
      token: `fake-jwt-token.${user.id}`,
      user
    });
  }

  function register() {
    const { username, email, password } = body;

    if (users.find(x => x.username === username)) {
      return error(`Username "${username}" is already taken`);
    }

    const user: User = {
      id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
      username,
      email,
      role: 'user'
    };

    users.push(user);
    setLocalStorageItem('users', users);

    return ok({
      token: `fake-jwt-token.${user.id}`,
      user
    });
  }

  function getProducts() {
    products = getLocalStorageItem('products');
    return ok(products);
  }

  function getProductById() {
    const id = idFromUrl();
    const product = products.find((x: Product) => x.id === id);
    return product ? ok(product) : error('Product not found');
  }

  function createProduct() {
    const product: Product = body;
    product.id = products.length ? Math.max(...products.map((x: Product) => x.id)) + 1 : 1;
    products.push(product);
    setLocalStorageItem('products', products);
    return ok(product);
  }

  function updateProduct() {
    const id = idFromUrl();
    const productIndex = products.findIndex((x: Product) => x.id === id);
    if (productIndex === -1) return error('Product not found');

    products[productIndex] = { ...products[productIndex], ...body };
    setLocalStorageItem('products', products);
    return ok(products[productIndex]);
  }

  function deleteProduct() {
    const id = idFromUrl();
    products = products.filter((x: Product) => x.id !== id);
    setLocalStorageItem('products', products);
    return ok();
  }

  // Вспомогательные функции
  function ok(body?: any) {
    console.log('Returning mock response:', body);
    return of(new HttpResponse({ status: 200, body }));
  }

  function error(message: string) {
    console.error('Mock backend error:', message);
    return throwError(() => ({ error: { message } }));
  }

  function idFromUrl() {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
  }
}; 