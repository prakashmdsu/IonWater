
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService<T> {

  constructor(private http: HttpClient) { }
  HttpPost(bodydata: T, urlpath: string): Observable<T> {
    let url = environment.apiurl + urlpath
    return this.http.post<T>(url, bodydata, httpOptions);
  }
  HttpGet(urlpath: string): Observable<T[]> {
    return this.http.get<T[]>(environment.apiurl + urlpath, httpOptions).pipe()
  }
  HttpPut(bodydata: any, urlpath: string): Observable<T> {
    return this.http.put<T>(environment.apiurl + urlpath, bodydata, httpOptions).pipe(
    );
  }
  HttpDelete(id: any, urlpath: string): Observable<any> {
    return this.http.delete(environment.apiurl + urlpath, httpOptions).pipe(
    )
  }
}
