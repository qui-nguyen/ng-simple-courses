import { Injectable, OnInit } from '@angular/core';
import { Category } from '../type';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('api/categories').pipe(
      // tap((res) => console.log(res)),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    )
  }
}
