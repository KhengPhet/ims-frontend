import {
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';


export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const authService = inject(AuthService);

  const token = AuthService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};