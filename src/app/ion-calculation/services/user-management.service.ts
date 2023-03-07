import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};
@Injectable({
    providedIn: "root",
})
export class UserManagementService<UserManagement> {
    constructor(private http: HttpClient) {

    }

    GetUserManager(urlpath: string): Observable<UserManagement[]> {
        return this.http.get<UserManagement[]>(environment.identityserverUrl + urlpath, httpOptions).pipe()
    }
}