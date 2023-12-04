import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RecipeExtendedQty } from '../type';

const API = `${environment.apiURL}shoplists`;

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient) { }

  getShopList(recipes: RecipeExtendedQty[]): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}`, recipes, httpOptions).pipe(
      tap((res) => {
        console.log(res);
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

  private log(response: any) {
    console.log(response);
  }

  private catchError(error: Error, errorValue: any) {
    console.log(error);
    return of(errorValue);
  }
}
