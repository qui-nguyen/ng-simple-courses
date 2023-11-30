import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Recipe, RecipeBody } from '../type';
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

  editMode: boolean = false;

  recipe: Recipe | null = null;
  recipeDialog: boolean = false;
  recipeSaved: boolean = false;
  newRecipeData: any;

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

  /*** Edit recipe ***/
  /* Edit click => open modal */
  editRecipe(recipe: Recipe) {
    this.editMode = true;
    this.recipe = recipe;
    this.recipeDialog = true;
  }

  /* Receive close modal signal */
  isRecipeDialogClick(openDialog: boolean) {
    this.recipeDialog = openDialog;
    this.recipe = null;
  }

  /* Receive save recipe signal and trigger save process => api call */
  // isRecipeSavedClick(isSaveClicked: boolean) {
  //   // Need a post call
  //   this.recipeSaved = true;
  //   this.recipeDialog = false;
  // }

  getNewRecipeData(data: RecipeBody) {
    if (this.recipe && this.editMode) {
      this.recipeService.updateRecipe(this.recipe._id, data).subscribe(
        {
          next: (result) => {
            const indexFounded = this.recipes.findIndex((el: Recipe) => el._id === result._id);
            this.recipes[indexFounded] = result;
            this.recipeSaved = true;
          },
          error: (err) => { console.log(err); },
          complete: () => { }
        }
      )
    } else {
      let recipeNameExist = false;
      this.recipeService.checkRecipeName(data.name).subscribe(
        {
          next: (result) => {
            recipeNameExist = result;
          },
          error: (err) => { console.log(err); },
          complete: () => {
            let severity = 'success';
            let summary = 'Félicitation !'
            let detail = 'Nouvelle recette ajoutée';

            if (recipeNameExist) {
              severity = 'error';
              summary = 'Erreur !'
              detail = `${data.name} existe`;

            } else {
              this.recipeService.createRecipe(data).subscribe(
                {
                  next: (result) => {
                    if (result) {
                      this.recipes.push(result);
                      this.recipeSaved = true;
                      this.recipeDialog = false;
                    }
                  },
                  error: (err) => { console.log(err); },
                  complete: () => { }
                }
              );
            }

            this.messageService.add({
              severity: severity,
              summary: summary,
              detail: detail,
              life: 3000
            });
          }
        }
      );
    }

  }

  /*** View detail click ***/
  detail(recipe: Recipe) {
  
   }


  /*** Create recipe ***/
  createRecipe() {
    this.recipe = new Recipe();
    this.recipeDialog = true;
  }

  confirmDelete() { }
}
