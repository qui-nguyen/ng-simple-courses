import { Injectable } from '@angular/core';
import { Category } from '../type';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = `${environment.apiURL}categories`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/all`).pipe(
      // tap((res) => console.log(res)),
      catchError((err) => {
        console.log(err);
        return of([]);
      })
    )
  }
}
