import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { IngredientRecipe, Product, RecipeList, ShoppingList, ShopList } from 'src/app/type';

import * as _ from 'lodash';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-customize-shop-list',
  templateUrl: './customize-shop-list.component.html'
})
export class CustomizeShopListComponent implements OnInit {
  shopListSelected: ShoppingList | null = null;
  recipes: any | null = null;
  productsInStock: Product[];

  shopListDialog: boolean = false;
  shopLists: ShoppingList[];
  shopList: ShoppingList | null = null;
  editMode: boolean = false;
  shopListData: any = null;

  compareResult: ShopList | undefined = undefined;
  isSimplifyVersion: boolean = false;

  constructor(
    private shopListService: ShoppingListService,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    this.shopListService.getAllShopLists().subscribe(res => this.shopLists = res);
    this.productService.getProducts().subscribe(res => this.productsInStock = res);
  }

  handleClose() { // accordion close
    this.shopListSelected = null;
  }

  deleteShopList(shopList: ShoppingList) {
    this.shopListService.deleteShopListById(shopList._id).subscribe(res => {
      if (!res) {
        this.shopLists = this.shopLists.filter((el: any) => el._id !== shopList._id);
        this.showMessage(false, 'Félicitation !', `${shopList.name} est suprimée`);
      } else {
        this.showMessage(true, 'Erreur !', `Une erreur survenue lors de la suppression de ${shopList.name}`);
      }
    })
  }

  confirmDelete(shopList: ShoppingList) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette liste ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteShopList(shopList);
      }
    });
  }

  handleSelectShopList(shopList: ShoppingList) {
    if (this.shopListSelected?._id === shopList._id) {
      this.shopListSelected = null;
      return;
    }
    this.shopListSelected = shopList;
    this.compareResult = undefined;
    this.isSimplifyVersion = false;
  }

  toogleCompareWithStock() {
    if (this.compareResult) {
      this.compareResult = undefined;
      this.isSimplifyVersion = false;
      return;
    }

    this.compareResult = this.shopListService.getShopList(this.shopListSelected!, this.productsInStock);
  }

  toogleSimplifyVersion() {
    this.isSimplifyVersion = !this.isSimplifyVersion;
  }

  /*** Shop List Modal Signal ***/
  handleCreateCustomizeShopList() {
    this.shopListDialog = true;
    this.editMode = false;
    this.shopList = new ShoppingList;
    this.shopListSelected = null;
  }

  handleUpdateCustomizeShopList() {
    this.shopListDialog = true;
    this.editMode = false;
    this.shopList = this.shopListSelected;
  }

  shopListEvent(event: any): void {
    this.shopListData = event;
    const transformData = {
      name: event.name,
      recipeListId: null,
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
    this.shopListSelected?._id
      ? this.updateCustomizeShopList(transformData)
      : this.createCustomizeShopList(transformData);
  }

  isShopListDialogOpen(event: any) {
    this.shopListDialog = false;
    this.editMode = false;
    this.shopList = null;
  }

  /*** Shop List Actions Trigger By Shop List Modal ***/
  createCustomizeShopList(data: any) {
    this.shopListService.checkShopListName(data.name).pipe(
      switchMap(res => {
        if (res === false) { // response = false
          return this.shopListService.createShopList(data);
        } else {
          this.showMessage(true, 'Erreur', `Nom ${data.name} existe, veuillez vérifier les noms des listes de recettes et des listes personnalisées !`);
          return of(null)
        };
      })
    ).subscribe((res) => {
      if (res) {
        this.shopLists.unshift(res);
        this.showMessage(false, 'Félicitation', 'Nouvelle liste est crée !');
        this.shopListDialog = false;
      } else {
        this.showMessage(true, 'Error', "Veuillez sélectionner des ingrédients proposées !");
      }
    })
  }

  updateCustomizeShopList(data: any) {
    if (this.shopListSelected?.name !== data.name) {
      this.shopListService.checkShopListName(data.name).pipe(
        switchMap(res => {
          if (res === false) { // response = false
            return this.shopListService.updateShopList(this.shopListSelected!._id, data);
          } else {
            this.showMessage(true, 'Erreur', `Nom ${data.name} existe, veuillez vérifier les noms des listes de recettes et des listes personnalisées !`);
            return of(null)
          };
        })
      ).subscribe((res) => {
        if (res) {
          const foundShopList = this.shopLists.findIndex((el: ShoppingList) => el._id === this.shopListSelected?._id);
          if (foundShopList !== -1) {
            this.shopLists[foundShopList] = res;
            this.shopListSelected = res;
            this.showMessage(false, 'Félicitation', 'La liste est modifiée');
            this.shopListDialog = false;
          }
        }

        if (!res) {
          this.showMessage(true, 'Error', 'Shop list not updated');
        }
      })
    } else {
      this.shopListService.updateShopList(this.shopListSelected!._id, data).subscribe((res) => {
        if (res) {
          const foundShopList = this.shopLists.findIndex((el: ShoppingList) => el._id === this.shopListSelected?._id);
          if (foundShopList !== -1) {
            this.shopLists[foundShopList] = res;
            this.shopListSelected = res;
            this.showMessage(false, 'Félicitation', 'La liste est modifiée');
            this.shopListDialog = false;
          }
        }
        if (!res) {
          this.showMessage(true, 'Error', 'Shop list not updated');
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
