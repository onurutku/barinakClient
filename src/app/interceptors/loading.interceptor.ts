import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}
  intercept(request: HttpRequest<any>, next: any): Observable<HttpEvent<any>> {
    this.loadingService.loadingSub.next(true);
    return next
      .handle(request)
      .pipe(
        catchError((err) => {
          this.loadingService.errorSub.next(err.error);
          this.loadingService.loadingSub.next(false);
          return throwError(err);
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this.loadingService.loadingSub.next(false);
          }
          return evt;
        })
      );
  }
}
