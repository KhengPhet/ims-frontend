import {
    HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';


export const jwtInterceptor: HttpInterceptorFn = (
    req,
    next
) => {
    const authService = inject(AuthService);
    const token = AuthService.getToken();
    if (!token) {
        return next(req);
    }
    const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
    return next(clonedRequest);
};