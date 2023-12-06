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
      tap((res) => {
        // console.log(res);
        // console.table('productsBrutInStock : ')
        // console.table(res?.productsBrutInStock)
        // console.table('Total : ')
        // console.table(res?.total)
        // console.table('notExistInStock : ')
        // console.table(res?.shopList.notExistInStock)
        // console.table(res?.shopList.notExistInStock)

        // console.table(res?.shopList.existInStockAndNeedAdd)

      }
      ),
      catchError((err) => this.catchError(err, []))
    );
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

  private log(response: any) {
    // console.log(response);
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }
}
