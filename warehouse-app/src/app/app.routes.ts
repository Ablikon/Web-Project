import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
