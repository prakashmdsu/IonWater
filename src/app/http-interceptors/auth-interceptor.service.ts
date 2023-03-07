import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Constants } from '../shared/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private _authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this._authService.getAccessToken())
            .pipe(
                switchMap(token => {
                    const headers = request.headers
                        .set('Authorization', 'Bearer ' + token)
                        .append('Content-Type', 'application/json');
                    const requestClone = request.clone({
                        headers
                    });
                    return next.handle(requestClone);
                })
            );
    }
}