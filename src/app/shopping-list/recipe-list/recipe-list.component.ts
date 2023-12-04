import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/type';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];
  selectedRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {

  }

  ngOnInit(): void {

    this.recipeService.getRecipes().subscribe(
      {
        next: (res) => {
          this.recipes = res
        },
        error: (err) => { console.log('Error when fetch recipes', err); this.recipes = []; }
      }
    );
  }
}
