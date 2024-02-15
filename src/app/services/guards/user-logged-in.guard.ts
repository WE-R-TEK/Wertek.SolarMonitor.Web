import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const userLoggedInGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  authService.getUser.subscribe(user => {
    console.log('userLoggedInGuard', user);
    if(!user) {
      router.navigate(['/login']);
    }
  });
  return true;
};
