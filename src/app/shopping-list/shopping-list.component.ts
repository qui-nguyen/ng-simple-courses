import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ShoppingListService } from '../services/shopping-list.service';
import { Router } from '@angular/router';
import { Product, Recipe, RecipeList, ShoppingList } from '../type';
import { RecipeService } from '../services/recipe.service';
import { ProductService } from '../services/product.service';
import { RecipeListService } from '../services/recipe-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [MessageService, ConfirmationService]
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
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

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

  // Delete
  deleteRecipeList(recipeList: any) {
    this.recipeListService.deleteRecipeListById(recipeList._id).subscribe(res => {
      if (!res) {
        this.recipeLists = this.recipeLists.filter((el: any) => el._id !== recipeList._id);
        this.showMessage(false, 'Félicitation !', `${recipeList.name} est suprimée`);
      } else {
        this.showMessage(true, 'Erreur !', `Une erreur survenue lors de la suppression de ${recipeList.name}`);
      }
    })
  }

  confirmDelete(recipeList: any) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette liste ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecipeList(recipeList);
      }
    });
  }

  goToRecipes() {
    this.router.navigateByUrl('/recipes');
  }

  goToRecipeDetailPage(recipeId: string) {
    this.router.navigateByUrl(`/recipes/${recipeId}`);
  }

  /*** Display a message using the MessageService  ***/
  private showMessage(isError: boolean, summary: string, detail: string): void {
    this.messageService.add({
      severity: `${isError ? 'error' : 'success'}`,
      summary: summary,
      detail: detail,
      life: 3000
    });
  }
}
