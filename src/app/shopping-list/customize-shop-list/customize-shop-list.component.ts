import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { IngredientRecipe, Product, RecipeList, ShoppingList } from 'src/app/type';

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

  updateCustomizeShopList(data: any) {
    this.shopListService.updateShopList(this.shopListSelected!._id, data).subscribe((res) => {
      if (res) {
        const foundShopList = this.shopLists.findIndex((el: ShoppingList) => el._id === this.shopListSelected?._id);
        console.log(foundShopList);
        if (foundShopList !== -1) {
          console.log(res);
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
