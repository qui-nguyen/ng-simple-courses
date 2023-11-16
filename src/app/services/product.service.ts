import { Injectable, OnInit } from '@angular/core';
import { PRODUCTS } from '../data/mock-product-list';
import { Product } from '../type';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit {
  products = PRODUCTS;
  constructor() { }

  ngOnInit(): void {
    this.products = PRODUCTS;
  }

  editProduct(id: number) {
    console.log(PRODUCTS.find((p: Product) => p.id === +id));
  }
}
