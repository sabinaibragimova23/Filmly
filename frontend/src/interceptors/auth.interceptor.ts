import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../app/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Token ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};