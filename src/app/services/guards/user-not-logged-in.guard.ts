import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const userNotLoggedInGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  authService.getUser.subscribe(user => {
    console.log('userNotLoggedInGuard', user);
    if(user) {
      router.navigate(['/']);
    }
  });
  return true;
};
