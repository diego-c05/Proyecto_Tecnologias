import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

export const coordinadorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.rol$.pipe(
    filter(rol => rol !== null),
    take(1),
    map(rol => {
      if (rol === 'coordinador') return true;

      router.navigate(['/eventos/vereventos'], { replaceUrl: true });
      return false;
    })
  );
};