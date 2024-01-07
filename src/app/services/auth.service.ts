import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../type';
import { StorageService } from './storage.service';

const API = `${environment.apiURL}auth`;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn: boolean = false;
  loginData: Login;
  redirectUrl: string = '/login';

  constructor(
    private http: HttpClient,
    private storageService: StorageService) { }

  login(email: string, password: string): Observable<Login> | any {
    // const isLoggedIn = (email === 'test@test.com' && password === 'test');

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}/signin`, { email, password }, httpOptions).pipe(
      tap((result: any) => {
        if (result && result?.user) {
          this.isLoggedIn = true;
          this.loginData = result;
        }
      }),
      catchError((error => this.catchError(error, undefined)))
    )

  }

  logout() {
    this.storageService.clean();
    this.isLoggedIn = false;
  }

  private log(response: any) {
    if (response) {
      // console.log(response);
    }
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }
}