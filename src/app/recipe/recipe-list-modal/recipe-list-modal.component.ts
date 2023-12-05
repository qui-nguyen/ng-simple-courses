import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';


import { RecipeListService } from 'src/app/services/recipe-list.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Recipe, RecipeList, ShopListData, ShoppingList } from 'src/app/type';


type RecipeExtendedQty = Recipe & {
  quantity: number;
};

@Component({
  selector: 'app-recipe-list-modal',
  templateUrl: './recipe-list-modal.component.html',
  providers: [ConfirmationService, MessageService]
})
export class RecipeListModalComponent {
  @Input() selectedRecipes: Recipe[] | null;
  @Input() recipeListDialog: boolean = false;
  @Output() recipeListEvent = new EventEmitter<any>();

  recipeList: RecipeList | undefined;
  recipeListName: string | null;

  newSelectedRecipes: RecipeExtendedQty[];
  shopListDialog: boolean = false;
  shopListData: ShopListData | undefined = undefined;

  newShopList: ShoppingList | undefined;
  isSaveShopListClick: boolean;


  constructor(
    private shopListService: ShoppingListService,
    private recipeListService: RecipeListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }


  /**** Watch the changement of parent => get values in real time ****/
  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRecipes' in changes) {
      if (this.selectedRecipes) {
        this.newSelectedRecipes = this.selectedRecipes.map((el: Recipe) => ({ ...el, quantity: 1 }));
      }
    }
  }

  ngOnInit(): void {
    this.recipeList = undefined;
    this.newShopList = undefined;
    this.isSaveShopListClick = false;
  }


  /**** Recipes List ****/
  handleOpenConfimDialog() {
    this.recipeListName = null;
    this.confirmationService.confirm({
      message: '',
      header: 'Confirmation'
    });
  }

  isRecipeListNameValid() {
    return !!this.recipeListName; // name not null
  }

  handleSaveRecipeList() {
    let isError = false;
    let summary = 'Liste des recettes est sauvegardée !';
    console.log('Vo');
    if (this.recipeListName) {
      this.recipeListService.checkRecipeListName(this.recipeListName).subscribe({
        next: (isExist) => {
          // Check if name exist
          if (isExist === false) {
            this.recipeListService.createRecipeList({
              name: this.recipeListName!,
              recipeListId: this.newSelectedRecipes.map(el => ({ recipeId: el._id, quantity: el.quantity })),
              shopListId: null,
              createdDate: new Date
            }).subscribe(
              {
                next: (res) => {
                  if (res) {
                    this.recipeList = res;
                    this.confirmationService.close();
                  } else {
                    isError = true;
                    summary = "Erreur survenue !"
                  }
                },
                complete: () => {
                  if (this.isSaveShopListClick) {
                    this.saveShopList();
                  }
                }
              }
            );

          } else if (isExist === true) {
            isError = true;
            summary = "Nom existe !"
          } else { // undefind or error when check name
            isError = true;
            summary = "Erreur !"
          }
        },
        complete: () => {
          this.messageService.add({
            severity: `${isError ? 'error' : 'success'}`,
            summary: summary,
            detail: '',
            life: 3000
          });
        },
      })
    }
  }

  handleCloseConfimDialog() {
    this.confirmationService.close();
  }

  hideDialog() {
    this.shopListDialog = false;
    this.selectedRecipes = null;
    this.recipeList = undefined;
    this.recipeListEvent.emit();
  }

  /**** Shop List ****/
  saveShopList() {
    if (this.recipeList && this.shopListData) {
      let isError = false;
      let summary = 'Nouvelle liste des courses sauvegardée !';

      this.shopListService.createShopList(
        {
          name: this.recipeList.name,
          recipeListId: this.recipeList._id,
          shopList: this.shopListData.shopList,
          createdDate: new Date
        }
      ).subscribe({
        next: (res) => {
          if (res) {
            this.newShopList = res;
          } else {
            isError = true;
            summary = 'Erreur de sauvegarde nouvelle liste des courses !';
          }
        },
        complete: () => {
          this.isSaveShopListClick = false;
          this.messageService.add({
            severity: `${isError ? 'error' : 'success'}`,
            summary: summary,
            detail: '',
            life: 3000
          });
        },

      })
    }
  }

  showShopList() {
    this.shopListDialog = true;
    this.shopListService.getShopList(this.newSelectedRecipes).subscribe(res => this.shopListData = res);
  }

  returnRecipeList() {
    this.shopListDialog = false;
  }

  saveAll() {
    if (this.recipeList) {
      this.saveShopList();
    } else {
      this.isSaveShopListClick = true;
      this.handleOpenConfimDialog();
      this.handleSaveRecipeList();
    }
    // this.hideDialog();
    // this.recipeListEvent.emit();
  }
}
