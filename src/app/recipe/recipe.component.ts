import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Recipe } from '../type';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class RecipeComponent implements OnInit {

  recipes: Recipe[];
  selectedRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe((res: Recipe[]) => this.recipes = res);

  }

  getDisplayedIngredients(recipe: Recipe): string[] {
    return recipe.ingredients.length > 2
      ? recipe.ingredients.slice(0, 2).map((ingredient) => ingredient.productBrut.alim_nom_fr)
      : recipe.ingredients.map((ingredient) => ingredient.productBrut.alim_nom_fr);
  }

  selectedRecipe(recipe: Recipe) { }

  editRecipe(recipe: Recipe) { }

  detail(recipe: Recipe) { }

  createRecipe() { }

  confirmDelete() { }
}
