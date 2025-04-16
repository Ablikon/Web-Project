import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RegisterComponent } from './components/register/register.component';
import { canActivate } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  { 
    path: 'products', 
    component: ProductListComponent, 
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent, 
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager'] }
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent, 
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/category/category-list/category-list.component').then(m => m.CategoryListComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  {
    path: 'inventory',
    loadComponent: () => import('./components/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  {
    path: 'inventory/add',
    loadComponent: () => import('./components/inventory/inventory-form/inventory-form.component').then(m => m.InventoryFormComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  {
    path: 'movements',
    loadComponent: () => import('./components/movements/movement-list/movement-list.component').then(m => m.MovementListComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  {
    path: 'movements/new',
    loadComponent: () => import('./components/movements/movement-form/movement-form.component').then(m => m.MovementFormComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager', 'storekeeper'] }
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [canActivate],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [canActivate],
    data: { roles: ['admin'] }
  },
  {
    path: 'users/new',
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [canActivate],
    data: { roles: ['admin'] }
  },
  {
    path: 'users/edit/:id',
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [canActivate],
    data: { roles: ['admin'] }
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./components/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
