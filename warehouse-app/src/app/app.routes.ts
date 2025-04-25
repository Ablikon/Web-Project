import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RegisterComponent } from './components/register/register.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory/inventory-form/inventory-form.component';
import { MovementListComponent } from './components/movements/movement-list/movement-list.component';
import { MovementFormComponent } from './components/movements/movement-form/movement-form.component';
import { ReportsDashboardComponent } from './components/reports/reports-dashboard/reports-dashboard.component';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // App routes wrapped in layout with sidebar
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Products
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      
      // Categories
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      
      // Inventory
      { path: 'inventory', component: InventoryListComponent },
      { path: 'inventory/new', component: InventoryFormComponent },
      { path: 'inventory/edit/:id', component: InventoryFormComponent },
      
      // Movements
      { path: 'movements', component: MovementListComponent },
      { path: 'movements/new', component: MovementFormComponent },
      { path: 'movements/edit/:id', component: MovementFormComponent },
      
      // Reports
      { path: 'reports', component: ReportsDashboardComponent },
      
      // Default route
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ]
  },
];
