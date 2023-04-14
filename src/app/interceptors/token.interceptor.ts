import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user: User | null = this.authService.userValue;

    if (user) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user?.access_token}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            return this.handleError401(request, next, user);
          } else {
            return throwError(err);
          }
        }
        this.router.navigate(['/login']);
        return throwError(err);
      })
    );
  }
  handleError401(
    request: HttpRequest<any>,
    next: HttpHandler,
    user: any
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(user?.refresh_token);
      return this.authService.getRefreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);

          this.setNewToken(token, user);

          return next.handle(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${token.access_token}`,
              },
            })
          );
        }),
        catchError((err) => {
          this.router.navigate(['/login']);
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${jwt}`,
              },
            })
          );
        })
      );
    }
  }
  setNewToken(token: any, user: any) {
    const newUser: any = {
      access_token: token.access_token,
      refresh_token: user?.refresh_token,
    };
    sessionStorage.setItem('user', JSON.stringify(newUser));
  }
}
