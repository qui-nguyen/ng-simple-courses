import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RecipeExtendedQty, ShoppingList, ShoppingListBody } from '../type';

const API = `${environment.apiURL}shoplists`;

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient) { }

  getAllShopLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${API}/all`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
  }

  getShopList(recipes: RecipeExtendedQty[]): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}/view`, recipes, httpOptions).pipe(
      // tap((res) => {
      //   console.log(res);
      // }),
      catchError((err) => this.catchError(err, []))
    );
  }

  updateShopList(id: string, data: any): Observable<ShoppingList | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(`${API}/${id}`, data, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  createShopList(data: ShoppingListBody): Observable<ShoppingList | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}`, data, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  deleteShopListById(id: string): Observable<ShoppingList | any> {
    return this.http.delete<ShoppingList>(`${API}/${id}`).pipe(
      tap((res) => this.log(res)), // res = null if delete ok
      catchError((error) => {
        console.error('Error deleting shop list:', error);
        return of({ id, error });
      })
    );
  }

  private log(response: any) {
    // console.log(response);
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }
}
