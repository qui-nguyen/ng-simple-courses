import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RecipeListBody } from '../type';

const API = `${environment.apiURL}recipeLists`;

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {
  constructor(private http: HttpClient) { }

  checkRecipeListName(recipeListName: string): Observable<any> {
    console.log(recipeListName);
    return this.http.get(`${API}/recipe-list-name-check?name=${recipeListName}`).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  createRecipeList(recipes: RecipeListBody): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}`, recipes, httpOptions).pipe(
      tap((res) => {
        console.log(res);
      }
      ),
      catchError((err) => this.catchError(err, undefined))
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
