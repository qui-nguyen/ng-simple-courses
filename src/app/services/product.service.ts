import { Injectable, OnInit } from '@angular/core';
import { PRODUCTS } from '../data/mock-product-list';
import { Product } from '../type';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('api/products').pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`api/products/${id}`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, undefined))
    )
  }

  deleteProductById(id: number): Observable<Product | undefined> {
    return this.http.delete<Product>(`api/products/${id}`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, undefined))
    )
  }

  editProduct(id: number) {
    console.log(PRODUCTS.find((p: Product) => p.id === +id));
  }

  private log(response: any) {
    console.log(response);
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }

}
