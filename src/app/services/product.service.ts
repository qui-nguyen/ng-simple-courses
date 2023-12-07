import { Injectable } from '@angular/core';
import { Product, ProductBody } from '../type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


const API = `${environment.apiURL}products`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/all`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${API}/${id}`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, undefined))
    )
  }

  updateProduct(id: string, product: ProductBody): Observable<Product | any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(`${API}/${id}`, product, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  createProduct(newProduct: ProductBody): Observable<Product | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}`, newProduct, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  deleteProductById(id: string): Observable<Product | any> {
    return this.http.delete<Product>(`${API}/${id}`).pipe(
      tap((res) => this.log(res)), // res = null if delete ok
      catchError((error) => {
        console.error('Error deleting product:', error);
        // Emit an object with product ID and error
        return of({ id, error });
      })
    );
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
