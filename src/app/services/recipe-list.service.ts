import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RecipeList, RecipeListBody } from '../type';

const API = `${environment.apiURL}recipeLists`;

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {
  constructor(private http: HttpClient) { }

  getRecipeLists(): Observable<any> {
    return this.http.get(`${API}/all`).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  checkRecipeListName(recipeListName: string): Observable<any> {
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

  updateRecipeList(id: string, recipeList: RecipeList | RecipeListBody): Observable<RecipeList | any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(`${API}/${id}`, recipeList, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  deleteRecipeListById(id: string): Observable<any> {
    return this.http.delete<string>(`${API}/${id}`).pipe(
      tap((res) => this.log(res)), // res = null if delete ok
      catchError((error) => {
        console.error('Error deleting product:', error);
        // Emit an object with product ID and error
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
