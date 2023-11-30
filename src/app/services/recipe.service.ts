import { Injectable } from '@angular/core';
import { Recipe, RecipeBody } from '../type';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


const API = `${environment.apiURL}recipes`;

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${API}/all`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, [])))
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.http.get<Recipe>(`${API}/${id}`).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.catchError(err, undefined))
    )
  }

  updateRecipe(id: string, recipe: RecipeBody): Observable<Recipe | any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(`${API}/${id}`, recipe, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  createRecipe(recipe: RecipeBody): Observable<Recipe | undefined> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${API}`, recipe, httpOptions).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  checkRecipeName(recipeName: string): Observable<any> {
    return this.http.get(`${API}/recipe-name-check?name=${recipeName}`).pipe(
      tap((result) => this.log(result)),
      catchError((error => this.catchError(error, undefined)))
    )
  }

  deleteRecipeById(id: string): Observable<Recipe | any> {
    return this.http.delete<Recipe>(`${API}/${id}`).pipe(
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
