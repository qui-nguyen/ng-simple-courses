import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';


import { RecipeListService } from 'src/app/services/recipe-list.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Recipe, RecipeList, ShopListData } from 'src/app/type';


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

          // setTimeout(() => {
          //   !isError && this.hideDialog();
          // }, 4000);
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
  showShopList() {
    this.shopListDialog = true;
    this.shopListService.getShopList(this.newSelectedRecipes).subscribe(res => this.shopListData = res);
  }

  returnRecipeList() {
    this.shopListDialog = false;
  }

  saveAll() {
    this.hideDialog();
    this.recipeListEvent.emit();
  }





}
