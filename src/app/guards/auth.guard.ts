import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.usuario$.pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (user) { 
        return true;
      } 
      else { 
        router.navigate(['/inicio-sesion'],
        { replaceUrl: true }); return false; 
      }
    })
  );
};