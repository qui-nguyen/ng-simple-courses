import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data/mock-product-list';
import { Product } from '../type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  updateProduct(product: Product): Observable<Product | any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put('api/products', product, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  createProduct(newProduct: Product): Observable<Product | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post('api/products', newProduct, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  deleteProductById(id: number): Observable<Product | any> {
    return this.http.delete<Product>(`api/products/${id}`).pipe(
      tap((res) => this.log(res)), // res = null if delete ok
      catchError((error) => {
        console.error('Error deleting product:', error);
        // Emit an object with product ID and error
        return of({ id, error });
      })
    );
  }

  editProduct(id: number) {
    console.log(PRODUCTS.find((p: Product) => p.id === +id));
  }

  private log(response: any) {
    // console.log(response);
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }

}
