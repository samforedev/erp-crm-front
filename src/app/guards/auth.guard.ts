import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    console.warn('Acceso denegado: Usuario no autenticado. Redirigiendo a /login');
    router.navigate(['/login']).then();
    return false;
  }
};
