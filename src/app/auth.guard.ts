import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { inject } from '@angular/core';

import { StorageService } from './services/storage.service';

export function authGuard(): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const oauthService: AuthService = inject(AuthService);
    const storageService: StorageService = inject(StorageService);

    if (storageService.isLoggedIn()) {
      return true;
    }

    if (oauthService.isLoggedIn) {
      return true;
    }
    router.navigate([oauthService.redirectUrl])
    return false;
  };
};
