import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../services/shopping-list.service';
import { Router } from '@angular/router';
import { Product, Recipe, RecipeList, ShoppingList } from '../type';
import { RecipeService } from '../services/recipe.service';
import { ProductService } from '../services/product.service';
import { RecipeListService } from '../services/recipe-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {

  data: ShoppingList[] = [];
  shopListSelected: any | undefined = undefined;
  recipes: any | null = null;
  productsInStock: Product[];

  recipeLists: any;
  recipeListSelected: any;

  constructor(
    private recipeListService: RecipeListService,
    private shopListService: ShoppingListService,
    private recipeService: RecipeService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.shopListService.getAllShopLists().subscribe(res => this.data = res);
    this.productService.getProducts().subscribe(res => this.productsInStock = res);
    this.recipeListService.getRecipeLists().subscribe(res => this.recipeLists = res);
  }


  // handleSelectShopList(shopList: ShoppingList) {
  //   let recipes: any = [];
  //   console.log(shopList);

  //   shopList.recipeListId?.recipeIds.map((el: any) => {
  //     this.recipeService.getRecipeById(el.recipeId).subscribe(res => recipes.push({ ...res, quantity: el.quantity }));
  //   })

  //   this.shopListSelected = {
  //     ...shopList,
  //     recipes: recipes
  //   };
  // }

  handleSelectRecipeList(recipeList: RecipeList | any) {
    if (this.recipeListSelected && (this.recipeListSelected._id === recipeList._id)) {
      this.recipeListSelected = undefined; return
    }

    this.recipeListSelected = recipeList;
    const RecipeIdExtendedQtyArray = recipeList.recipeIds.map((el: any) => ({ ...el.recipeId, quantity: el.quantity }));
    this.shopListService.getShopList(RecipeIdExtendedQtyArray).subscribe(res => this.shopListSelected = res);

  }

  handleClose() {
    this.shopListSelected = undefined;
    this.recipeListSelected = undefined;
  }

  goToRecipes() {
    this.router.navigateByUrl('/shopping-list/recipes');
  }

  goToRecipeDetailPage(recipeId: string) {
    this.router.navigateByUrl(`/recipes/${recipeId}`);
  }
}
