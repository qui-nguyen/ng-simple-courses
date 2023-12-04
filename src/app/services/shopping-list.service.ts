import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API = `${environment.apiURL}shoplists`;

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient) { }

  getShopList(): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer...'
    });

    return this.http.get<any>(`${API}`, {
      headers: headers
    }).pipe(
      tap((res) => {
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
