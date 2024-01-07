import { Injectable } from '@angular/core';
import { Product, ProductBrut } from '../type';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


const API = `${environment.apiURL}productbruts`;

@Injectable({
  providedIn: 'root'
})
export class ProductBrutService {
  constructor(private http: HttpClient) { }

  getProductsBrut(): Observable<ProductBrut[]> {
    return this.http.get<ProductBrut[]>(`${API}/all/simple`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
  }

  getProductsByName(searchTerm: string): Observable<ProductBrut[]> {
    return this.http.get<ProductBrut[]>(`${API}?name=${searchTerm}`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
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
