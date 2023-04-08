import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user: User | null = this.authService.userValue;
    if (user) {
      const modifiedRequest = request.clone({
        headers: request.headers.set('Bearer', user?.access_token!),
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
        return throwError(err);
      })
    );
  }
}
