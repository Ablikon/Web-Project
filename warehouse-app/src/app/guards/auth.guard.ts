import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.getCurrentUser();
  
  // Check if user is logged in
  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Check if route has any role requirements
  if (route.data['roles'] && route.data['roles'].length) {
    // Check if user has required role
    if (!authService.hasRole(route.data['roles'])) {
      router.navigate(['/access-denied']);
      return false;
    }
  }
  
  return true;
}; 