import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
  const router = inject(Router); // Injecting Router service to handle redirection
  const token = localStorage.getItem('authToken'); // Adjust according to how you store the token

  if (token) {
    // If token exists, user is authenticated, allow route activation
    return true;
  } else {
    // If token does not exist, user is not authenticated, redirect to sign-up page
    router.navigate(['/signup']);
    return false;
  }
};
