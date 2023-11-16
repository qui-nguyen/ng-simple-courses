import { Injectable, OnInit } from '@angular/core';
import { Category } from '../type';
import { CATEGORIES } from '../data/mock-category-list';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnInit {
  categories: Category[] = CATEGORIES;

  constructor() { }
  ngOnInit(): void {
    this.categories = CATEGORIES;
  }
}
