import { Injectable } from '@angular/core';
import { Recipe, RecipeBody } from '../type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
