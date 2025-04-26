import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RegisterComponent } from './components/register/register.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { MovementListComponent } from './components/movement-list/movement-list.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'products', 
    component: ProductListComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories/new',
    component: CategoryFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories/edit/:id',
    component: CategoryFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    component: InventoryListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'movements',
    component: MovementListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
