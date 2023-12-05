import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../services/shopping-list.service';
import { Router } from '@angular/router';
import { Product, Recipe, RecipeList, ShoppingList } from '../type';
import { RecipeService } from '../services/recipe.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {

  data: ShoppingList[] = [];
  shopListSelected: any | undefined = undefined;
  recipes: any | null = null;
  productsInStock: Product[];

  constructor(
    private shopListService: ShoppingListService,
    private recipeService: RecipeService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.shopListService.getAllShopLists().subscribe(res => this.data = res);
    this.productService.getProducts().subscribe(res => this.productsInStock = res);
  }

  goToRecipes() {
    this.router.navigateByUrl('/shopping-list/recipes');
  }

  handleSelectShopList(shopList: ShoppingList) {
    let recipes: any = [];

    shopList.recipeListId?.recipeIds.map((el: any) => {
      this.recipeService.getRecipeById(el.recipeId).subscribe(res => recipes.push({ ...res, quantity: el.quantity }));
    })

    this.shopListSelected = {
      ...shopList,
      recipes: recipes
    };
  }

  handleClose() {
    this.shopListSelected = undefined;
  }
}
