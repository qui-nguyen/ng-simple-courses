import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Observable, Subject, map, of, switchMap, takeUntil, tap } from 'rxjs';

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
    private cdr: ChangeDetectorRef
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

  /*** Handle saving the recipe list ***/
  handleSaveRecipeList(): void {
    if (this.recipeListName) {
      this.recipeListService.checkRecipeListName(this.recipeListName).pipe(
        // tap(isExist => console.log(isExist)),
        switchMap(isExist => {
          if (isExist) {
            // If the recipe list name already exists, return an observable with a null value
            return of(null);
          } else {
            // If the recipe list name does not exist, create a new recipe list
            return this.recipeListService.createRecipeList({
              name: this.recipeListName!,
              recipeIds: this.newSelectedRecipes.map(el => ({ recipeId: el._id, quantity: el.quantity })),
              shopListId: null,
              createdDate: new Date()
            });
          }
        })
      ).subscribe((res) => {
        if (res) {
          // If res is not null => a new recipe list was created successfully
          this.recipeList = res;
          this.confirmationService.close();
          this.showMessage(false, `${res.name} est sauvegardée`);
        } else {
          this.showMessage(true, `${res === null ? 'Nom existe' : 'Erreur survenue !'}`);
        }
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
    this.selectedRecipes = [];
    this.recipeList = undefined;
    this.recipeListEvent.emit();
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
