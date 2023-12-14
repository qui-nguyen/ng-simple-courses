import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { asapScheduler, of, switchMap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { RecipeListService } from 'src/app/services/recipe-list.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { IngredientRecipe, Product, Recipe, RecipeList, ShoppingList } from 'src/app/type';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

  shopListSelected: any | undefined = undefined;
  recipes: any | null = null;
  productsInStock: Product[];

  recipeLists: any = [];
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
  ) { }

  ngOnInit(): void {
    this.shopListService.getAllShopLists().subscribe(res => this.shopLists = res);
    this.productService.getProducts().subscribe(res => this.productsInStock = res);
    this.recipeListService.getRecipeLists().subscribe(
      {
        next: (res) => {
          this.recipeLists = res;
        },
      }
    );
  }

  handleSelectRecipeList(recipeList: RecipeList | any) {
    if (this.recipeListSelected && (this.recipeListSelected._id === recipeList._id)) {
      this.recipeListSelected = undefined; return;
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
  deleteRecipeList(recipeList: any) {
    this.recipeListService.deleteRecipeListById(recipeList._id).subscribe(res => {
      if (!res) {
        // this.shoppingListSignal.removeRecipeList(recipeList);
        this.recipeLists = this.recipeLists.filter((el: any) => el._id !== recipeList._id);
        this.showMessage(false, 'Félicitation !', `${recipeList.name} est suprimée`);
      } else {
        this.showMessage(true, 'Erreur !', `Une erreur survenue lors de la suppression de ${recipeList.name}`);
      }
    })
  }

  confirmDelete(recipeList: any) {
    const message = recipeList.shopListId
        ? `La liste des courses personnalisée sera supprimmée avec ${recipeList.name}. Êtes-vous sûr de vouloir supprimer cette liste ?`
      : 'Êtes-vous sûr de vouloir supprimer cette liste ?';

    this.confirmationService.confirm({
      message: message,
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

  confirmGoToRecipes() {
    this.confirmationService.confirm({
      message: 'Voulez-vous quitter cette page ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goToRecipes();
      }
    });
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

    this.recipeListSelected.shopListId
      ? this.updateCustomizeShopList(transformData)
      : this.createCustomizeShopList(transformData);
  }

  isShopListDialogOpen(event: any) {
    this.shopListDialog = false;
    this.editMode = false;
    this.shopList = null;
  }

  /*** Shop List Actions ***/
  createCustomizeShopList(data: any) {
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

  updateCustomizeShopList(data: any) {
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
