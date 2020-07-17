import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.inj.get(AuthService);
    const authToken = authService.getToken();
    if (authToken) {
      const authReq = request.clone({ headers: request.headers.set('Authorization', authToken) });
      return next.handle(authReq);
    } else {
      return next.handle(request);
    }
  }
}

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private inj: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.inj.get(AuthService);
    const authToken = authService.getToken();

    return next
      .handle(request)
      .pipe(tap((event: HttpEvent<any>) => {
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 && authToken) {
            authService.checkJWTtoken();
          }
        }
      }));
  }
}
