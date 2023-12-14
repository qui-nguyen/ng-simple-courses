import { Component, OnInit, effect } from '@angular/core';
import { asapScheduler } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ShoppingListService } from '../services/shopping-list.service';
import { Router } from '@angular/router';
import { IngredientRecipe, Product, Recipe, RecipeList, ShoppingList } from '../type';
import { RecipeService } from '../services/recipe.service';
import { ProductService } from '../services/product.service';
import { RecipeListService } from '../services/recipe-list.service';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ShoppingListComponent implements OnInit {

  // data: ShoppingList[] = [];
  shopListSelected: any | undefined = undefined;
  recipes: any | null = null;
  productsInStock: Product[];

  recipeLists: any;
  recipeListSelected: any;

  shopListDialog: boolean = false;
  shopLists: ShoppingList[] = [];
  shopList: ShoppingList | null = null;
  editMode: boolean = false;
  shopListData: any = null;


  constructor(
    private recipeListService: RecipeListService,
    private shopListService: ShoppingListService,
    private recipeService: RecipeService,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.shopListService.getAllShopLists().subscribe(res => this.shopLists = res);
    this.productService.getProducts().subscribe(res => this.productsInStock = res);
    this.recipeListService.getRecipeLists().subscribe(res => { this.recipeLists = res });
  }

  handleSelectRecipeList(recipeList: RecipeList | any) {
    if (this.recipeListSelected && (this.recipeListSelected._id === recipeList._id)) {
      this.recipeListSelected = undefined; return
    }

    this.recipeListSelected = recipeList;
    const RecipeIdExtendedQtyArray = recipeList.recipeIds.map((el: any) => ({ ...el.recipeId, quantity: el.quantity }));
    this.shopListService.getShopList(RecipeIdExtendedQtyArray).subscribe(res => this.shopListSelected = res);
  }

  handleClose() { // accordion close
    this.shopListSelected = undefined;
    this.recipeListSelected = undefined;
  }

  // Delete
  // deleteRecipeList(recipeList: any) {
  //   this.recipeListService.deleteRecipeListById(recipeList._id).subscribe(res => {
  //     if (!res) {
  //       this.recipeLists = this.recipeLists.filter((el: any) => el._id !== recipeList._id);
  //       this.showMessage(false, 'Félicitation !', `${recipeList.name} est suprimée`);
  //     } else {
  //       this.showMessage(true, 'Erreur !', `Une erreur survenue lors de la suppression de ${recipeList.name}`);
  //     }
  //   })
  // }

  // confirmDelete(recipeList: any) {
  //   this.confirmationService.confirm({
  //     message: 'Êtes-vous sûr de vouloir supprimer cette liste ?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.deleteRecipeList(recipeList);
  //     }
  //   });
  // }

  goToRecipes() {
    this.router.navigateByUrl('/recipes');
  }

  goToRecipeDetailPage(recipeId: string) {
    this.router.navigateByUrl(`/recipes/${recipeId}`);
  }

  /*** Shop List Modal Signal ***/
  handleCreateCustomizeShopList() {
    this.shopListDialog = true;
    this.editMode = false;
    this.shopList = new ShoppingList;
    this.recipeListSelected = null;
  }

  handleAddCustomizeShopListToRecipeList() {
    console.log(this.recipeListSelected.shopListId);
    this.shopListDialog = true;
    this.editMode = false;
    this.shopList = this.recipeListSelected.shopListId || { ...new ShoppingList, name: this.recipeListSelected.name };
  }

  shopListEvent(event: any): void {
    this.shopListData = event;
    const transformData = {
      name: event.name,
      recipeListId: this.recipeListSelected?._id || null,
      shopList: null,
      shopListCustomize: event.ingredients.map((el: IngredientRecipe) => (
        {
          productBrutId: el.productBrut._id,
          alim_nom_fr: el.productBrut.alim_nom_fr,
          quantity: el.quantity,
          unit: el.unit
        }
      )),
      createdDate: new Date()
    }
    if (this.recipeListSelected) {

    } else {

    }
    this.updateCustomizeShopList(this.recipeListSelected?._id ? true : false, transformData);
    // this.createCustomizeShopList(this.recipeListSelected?._id ? true : false, transformData);
  }

  isShopListDialogOpen(event: any) {
    this.shopListDialog = false;
    this.editMode = false;
    this.shopList = null;
  }

  /*** Shop List Actions ***/
  createCustomizeShopList(haveRecipeListId: boolean, data: any) {
    if (haveRecipeListId) {
      this.shopListService.createShopList(data).pipe(
        switchMap(res => {
          if (res) {
            this.showMessage(false, 'Félicitation', 'Shop liste personnalisé rajouté');
            return this.recipeListService.updateRecipeList(
              this.recipeListSelected._id, { ...this.recipeListSelected, shopListId: res._id }
            )
          } else {
            this.showMessage(true, 'Error', "Shop liste personnalisé n'est pas enregistrée");
            return of(null)
          };
        })
      ).subscribe((res) => {
        if (res) {
          const foundRecipeList = this.recipeLists.findIndex((el: RecipeList) => el._id === res._id);
          if (foundRecipeList !== -1) {
            this.recipeLists[foundRecipeList].shopListId = res;
            this.showMessage(false, 'Félicitation', 'added');
            this.recipeListSelected.shopListId = res;
            this.shopListDialog = false;
            console.log(this.shopList);
          } else {
            this.showMessage(true, 'Error', 'recipes list not updated');
          }
        }
      })
    }

    if (!haveRecipeListId) {
      this.shopListService.createShopList(data).subscribe((res) => {
        if (res) {
          this.shopLists.unshift(res);
          this.showMessage(false, 'Félicitation', 'added');
          console.log(this.shopLists);
          this.shopListDialog = false;
        } else {
          this.showMessage(true, 'Error', 'recipes list not updated');
        }

      })
    }
  }

  updateCustomizeShopList(haveRecipeListId: boolean, data: any) {
    // updateShopList
    if (haveRecipeListId) {
      console.log(this.recipeListSelected.shopListId);
      this.shopListService
        .updateShopList(this.recipeListSelected.shopListId._id, data)
        .subscribe((res) => {
          if (res) {
            const foundRecipeList = this.recipeLists.findIndex((el: RecipeList) => el._id === this.recipeListSelected._id);
            if (foundRecipeList !== -1) {
              this.recipeLists[foundRecipeList].shopListId = res;
              this.showMessage(false, 'Félicitation', 'La liste est modifiée');
              this.recipeListSelected.shopListId = res;
              this.shopListDialog = false;
            } else {
              this.showMessage(true, 'Error', 'recipes list not updated');
            }
          }
        })
    }

    if (!haveRecipeListId) {
      this.shopListService.updateShopList(this.recipeListSelected.shopListId._id, data).subscribe((res) => {
        if (res) {
          this.shopLists.unshift(res);
          this.showMessage(false, 'Félicitation', 'La liste est modifiée');
          console.log(this.shopLists);
          this.shopListDialog = false;
        } else {
          this.showMessage(true, 'Error', 'recipes list not updated');
        }

      })
    }
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
