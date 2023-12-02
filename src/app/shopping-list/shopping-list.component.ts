import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../services/shopping-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {

  data: any;
  constructor(
    private shopListService: ShoppingListService,
    private router: Router) { }

  ngOnInit(): void {
    this.shopListService.getShopList().subscribe(res => this.data = res)
  }

  goToRecipes() {
    this.router.navigateByUrl('/shopping-list/recipes');
  }
}
