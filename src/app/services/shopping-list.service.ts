import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product, RecipeExtendedQty, ShoppingList, ShoppingListBody } from '../type';

import * as _ from 'lodash';

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

  getShopList(shopList: ShoppingList, prodStock: Product[]) {
    const totalIngredientsBrut = _.cloneDeep(shopList.shopListCustomize);

    const notExistInStock = totalIngredientsBrut?.filter(total =>
      !prodStock.some(stock => stock.productBrut._id === total.productBrutId)
    ) || [];

    const existInStockAndNeedAdd = totalIngredientsBrut?.filter(total =>
      prodStock.some(stock => {

        if (stock.productBrut._id === total.productBrutId) {
          if (stock.unit === total.unit) {
            // Modify the quantity and include the modified stock in the result
            if (stock.quantity < total.quantity) {
              total.quantity = total.quantity - stock.quantity;
            } else return false;
          }
          return true;
        }
        return false; // Don't find
      })
    ) || [];

    return { notExistInStock, existInStockAndNeedAdd }
  }

  getShopListByRecipeList(recipes: RecipeExtendedQty[]): Observable<any> {

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

  checkShopListName(shopListName: string): Observable<any> {
    return this.http.get(`${API}/shop-list-name-check?name=${shopListName}`).pipe(
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
