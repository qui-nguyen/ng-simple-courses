import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { PRODUCTS } from './data/mock-product-list';
import { CATEGORIES } from './data/mock-category-list';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return {
      products: PRODUCTS,
      categories: CATEGORIES
    }
  }
}
