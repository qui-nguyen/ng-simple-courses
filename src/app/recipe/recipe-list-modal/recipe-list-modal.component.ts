import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Recipe, ShopListData } from 'src/app/type';


type RecipeExtendedQty = Recipe & {
  quantity: number;
};

@Component({
  selector: 'app-recipe-list-modal',
  templateUrl: './recipe-list-modal.component.html'
})
export class RecipeListModalComponent {
  @Input() selectedRecipes: Recipe[] | null;
  @Input() recipesListDialog: boolean = false;
  @Output() recipesListEvent = new EventEmitter<any>();

  newSelectedRecipes: RecipeExtendedQty[];
  shopListDialog: boolean = false;
  shopListData: ShopListData | undefined = undefined;

  constructor(private shopListService: ShoppingListService) { }

  /**** Watch the changement of parent => get values in real time ****/
  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRecipes' in changes) {
      if(this.selectedRecipes) {
        this.newSelectedRecipes = this.selectedRecipes.map((el: Recipe) => ({ ...el, quantity: 1 }));
      }
    }
  }

  /**** Recipes List ****/
  showShopList() {
    this.shopListDialog = true;
    this.shopListService.getShopList(this.newSelectedRecipes).subscribe(res => this.shopListData = res);
  }

  saveRecipesList() {
    console.log(this.newSelectedRecipes);
    // this.shopListService.getShopList(this.newSelectedRecipes).subscribe(res => this.shopListData = res.shopListData);
  }

  hideDialog() {
    this.shopListDialog = false;
    this.selectedRecipes = null;
    this.recipesListEvent.emit();
  }

  /**** Shop List ****/
  returnRecipesList() {
    this.shopListDialog = false;
  }

  saveAll() {
    this.hideDialog();
    this.recipesListEvent.emit();
  }



}
