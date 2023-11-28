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

  
  //   getProductById(id: string): Observable<Product | undefined> {
  //     return this.http.get<Product>(`${API}/${id}`).pipe(
  //       tap((res) => this.log(res)),
  //       catchError((err) => this.catchError(err, undefined))
  //     )
  //   }

  //   updateProduct(product: Product): Observable<Product | any> {
  //     const httpOptions = {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //     };

  //     return this.http.put(`${API}`, product, httpOptions).pipe(
  //       tap((result) => this.log(result)),
  //       catchError((error => this.catchError(error, undefined)))
  //     )
  //   }

  //   createProduct(newProduct: Product): Observable<Product | undefined> {
  //     const httpOptions = {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //     };

  //     return this.http.post(`${API}`, newProduct, httpOptions).pipe(
  //       tap((result) => this.log(result)),
  //       catchError((error => this.catchError(error, undefined)))
  //     )
  //   }

  //   deleteProductById(id: string): Observable<Product | any> {
  //     return this.http.delete<Product>(`${API}/${id}`).pipe(
  //       tap((res) => this.log(res)), // res = null if delete ok
  //       catchError((error) => {
  //         console.error('Error deleting product:', error);
  //         // Emit an object with product ID and error
  //         return of({ id, error });
  //       })
  //     );
  //   }

  private log(response: any) {
    if (response === 200) {
      console.log(response);
    }
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }

}
