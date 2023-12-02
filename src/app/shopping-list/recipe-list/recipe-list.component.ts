import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/type';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];
  selectedRecipes: Recipe[];
  constructor() {

  }

  ngOnInit(): void {
    this.recipes = [];
    this.selectedRecipes = []
  }
}
