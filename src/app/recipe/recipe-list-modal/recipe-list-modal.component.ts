import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { RecipeListService } from 'src/app/services/recipe-list.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Recipe, RecipeExtendedQty, RecipeList, RecipeListBody, ShopListData, ShoppingList } from 'src/app/type';

@Component({
  selector: 'app-recipe-list-modal',
  templateUrl: './recipe-list-modal.component.html',
  providers: [ConfirmationService, MessageService]
})
export class RecipeListModalComponent implements OnInit {
  /*** Input properties to receive data from recipe component ***/
  @Input() selectedRecipes: Recipe[] | null;
  @Input() recipeListDialog = false;

  /*** Output property to emit events to recipe component ***/
  @Output() recipeListEvent = new EventEmitter<any>();

  /**** Component properties ***/
  recipeList: RecipeList | undefined;
  recipeListName: string | null;

  newSelectedRecipes: RecipeExtendedQty[];
  shopListDialog = false;
  shopListData: ShopListData | undefined = undefined;

  newShopList: ShoppingList | undefined;
  isSaveShopListClick = false;

  constructor(
    private shopListService: ShoppingListService,
    private recipeListService: RecipeListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) { }

  /*** Lifecycle hook => watch for changes in input properties (selectedRecipes) ***/
  ngOnChanges(changes: SimpleChanges): void {
    // Check for changes in 'selectedRecipes' and update 'newSelectedRecipes' accordingly
    if ('selectedRecipes' in changes && this.selectedRecipes) {
      // Map selected recipes to a new array with an additional 'quantity' property
      this.newSelectedRecipes = this.selectedRecipes.map((el: Recipe) => ({ ...el, quantity: 1 }));
    }
  }

  /*** Lifecycle hook => called after component initialization ***/
  ngOnInit(): void {
    // Initialize component properties
    this.recipeList = undefined;
    this.newShopList = undefined;
    this.isSaveShopListClick = false;
  }

  /*** Lifecycle hook => called after the component's view and child views have been checked => modal ***/
  ngAfterViewChecked(): void {
    // => check for changes in the component and its child components.
    // => ensure that the view reflects the most up-to-date state of the component.
    this.cdr.detectChanges();
  }

  /*** Handle opening the confirmation dialog => save process ***/
  handleOpenConfimDialog(): void {
    // Reset recipe list name and open the confirmation dialog
    this.recipeListName = null;
    this.confirmationService.confirm({
      message: '',
      header: 'Confirmation'
    });
  }

  /*** Check if the recipe list name is valid ***/
  isRecipeListNameValid(): boolean {
    return !!this.recipeListName; // Check if name is not null
  }

  /*** Update recipe list (after shop list saved) ***/
  updateRecipeList(recipeListId: string, recipeList: RecipeList) {
    this.recipeListService.updateRecipeList(recipeListId, recipeList).subscribe(res => console.log(res));
  }

  /*** Handle saving the recipe list (or both recipe list and shop list) ***/
  handleSaveRecipeList(): void {
    let isError = false;
    let summary = 'Liste des recettes est sauvegardée !';

    if (this.recipeListName) {
      // Check if the recipe list name already exists
      this.recipeListService.checkRecipeListName(this.recipeListName).subscribe({
        next: (isExist) => {
          if (isExist === false) {
            // Recipe list name does not exist, create a new recipe list
            this.recipeListService.createRecipeList({
              name: this.recipeListName!,
              recipeIds: this.newSelectedRecipes.map(el => ({ recipeId: el._id, quantity: el.quantity })),
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
                    summary = "Erreur survenue !";
                  }
                },
                complete: () => {
                  // Create a new shop list based on this recipe list created
                  if (this.isSaveShopListClick) {
                    this.saveShopList();
                  }
                }
              }
            );

          } else if (isExist === true) {
            // Recipe list name already exists
            isError = true;
            summary = "Nom existe !";
          } else {
            // Undefined or error when checking the name
            isError = true;
            summary = "Erreur !";
          }
        },
        complete: () => {
          // Display a message based on the result of the recipe list name check
          this.showMessage(isError, summary);
        },
      });
    }
  }

  /***  Handle closing the confirmation dialog => Close btn click ***/
  handleCloseConfimDialog(): void {
    this.confirmationService.close();
  }

  /***  Hide the dialog and emit an event to the recipe component ***/
  hideDialog(): void {
    this.shopListDialog = false;
    this.selectedRecipes = null;
    this.recipeList = undefined;
    this.recipeListEvent.emit();
  }

  /***  Save the shop list ***/
  saveShopList(): void {
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
            console.log(res);
            console.log(this.recipeList);
          } else {
            isError = true;
            summary = 'Erreur de sauvegarde nouvelle liste des courses !';
          }
        },
        complete: () => {
          // Update recipe list
          if (this.newShopList && this.recipeList) {
            this.updateRecipeList(this.recipeList._id, { ...this.recipeList, shopListId: this.newShopList._id });
          }
          this.isSaveShopListClick = false;
          // Display a message based on the result of shop list creation
          this.showMessage(isError, summary);
        },
      });
    }
  }

  /*** Show the shop list => review shop list (not saved) ***/
  showShopList(): void {
    this.shopListDialog = true;
    this.shopListService.getShopList(this.newSelectedRecipes).subscribe(res => this.shopListData = res);
  }

  /*** Return to the recipe list view from the shop list view ***/
  returnRecipeList(): void {
    this.shopListDialog = false;
  }

  /*** Save either the recipe list or both the recipe list and shop list ***/
  saveAll(): void {
    if (this.recipeList) { // Case recipeList is saved
      this.saveShopList();
    } else { // Case recipeList not saved yet
      this.isSaveShopListClick = true;
      this.handleOpenConfimDialog();
      this.handleSaveRecipeList();
    }
  }

  /*** Display a message using the MessageService  ***/
  private showMessage(isError: boolean, summary: string): void {
    this.messageService.add({
      severity: `${isError ? 'error' : 'success'}`,
      summary: summary,
      detail: '',
      life: 3000
    });
  }
}
