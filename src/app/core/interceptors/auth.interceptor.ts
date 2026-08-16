import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

let isRedirecting = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        handleUnauthorized(tokenService, router);
      }

      return throwError(() => error);
    }),
  );
};

function handleUnauthorized(tokenService: TokenService, router: Router): void {
  if (isRedirecting) {
    return;
  }

  isRedirecting = true;

  tokenService.logout();

  const currentUrl = router.url;
  const canRedirect =
    currentUrl && currentUrl !== '/' && !currentUrl.startsWith('/login');

  void router.navigate(['/login'], {
    queryParams: canRedirect ? { returnUrl: currentUrl } : {},
    replaceUrl: true,
  });

  setTimeout(() => {
    isRedirecting = false;
  }, 500);
}
