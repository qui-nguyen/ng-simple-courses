import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Recipe } from 'src/app/type';


type RecipeExtendedQty = Recipe & {
  quantity: number;
};

@Component({
  selector: 'app-recipe-list-modal',
  templateUrl: './recipe-list-modal.component.html'
})
export class RecipeListModalComponent {
  @Input() selectedRecipes: Recipe[];
  @Input() recipesListDialog: boolean = false;

  newSelectedRecipes: RecipeExtendedQty[];

  /**** Watch the changement of parent => get values in real time ****/
  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRecipes' in changes) {
      this.newSelectedRecipes = this.selectedRecipes.map((el: Recipe) => ({ ...el, quantity: 1 }));
    }
  }

  saveRecipesList() {
    console.log(this.newSelectedRecipes);
  }

  hideDialog() {
    this.recipesListDialog = false;
    
  }
}
