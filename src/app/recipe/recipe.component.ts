import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Recipe, RecipeBody } from '../type';
import { RecipeService } from '../services/recipe.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class RecipeComponent implements OnInit {

  recipes: Recipe[];
  selectedRecipes: Recipe[] | null = null;

  // Edit or create new recipe
  editMode: boolean = false;

  recipe: Recipe | null = null;
  recipeDialog: boolean = false;
  recipeSaved: boolean = false;
  newRecipeData: any;

  // Create new LIST recipes
  recipesListDialog: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe((res: Recipe[]) => this.recipes = res);
  }

  getDisplayedIngredients(recipe: Recipe): string[] {
    return recipe.ingredients.length > 2
      ? recipe.ingredients.slice(0, 2).map((ingredient) => ingredient.productBrut.alim_nom_fr)
      : recipe.ingredients.map((ingredient) => ingredient.productBrut.alim_nom_fr);
  }

  selectedRecipe(recipe: Recipe) { 
    // console.log(recipe);
    console.log(this.selectedRecipes);
  }

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

  private showAndResetMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }

  getNewRecipeData(data: RecipeBody) {
    let severity = 'success';
    let summary = 'Félicitation !';
    let detail = 'Nouvelle recette ajoutée';

    const updateRecipeSelected = (updatedRecipe: Recipe, selectedRecipes: Recipe[] | null): Recipe[] | null => {
      if (selectedRecipes === null) {
        return null;
      } else {
        const index = selectedRecipes.findIndex(recipe => recipe._id === updatedRecipe._id);
        if (index !== -1) { // recipe updated found in recipes selected list
          const updatedSelectedRecipes = selectedRecipes.map((recipe, i) => i === index ? { ...recipe, ...updatedRecipe } : recipe);
          return updatedSelectedRecipes;
        }
        return selectedRecipes;
      }
    }

    const handleRecipeUpdate = (result: Recipe | undefined) => {
      if (result) {
        const indexFounded = this.recipes.findIndex((el: Recipe) => el._id === result._id);
        this.recipes[indexFounded] = result;
        this.recipeSaved = true;
        this.recipe = null;
        this.recipeDialog = false;
        this.selectedRecipes = updateRecipeSelected(result, this.selectedRecipes);

        severity = 'success';
        summary = 'Félicitation !';
        detail = `${result.name} est modifiée !`;
      } else {
        severity = 'error';
        summary = 'Erreur !';
        detail = `Une erreur survenue lors de la maj de la recette`;
      }
      this.showAndResetMessage(severity, summary, detail);
    };

    const handleError = (err: any) => {
      console.log(err);
      severity = 'error';
      summary = 'Erreur !';
      detail = `Une erreur survenue lors de la maj de la recette`;
      this.showAndResetMessage(severity, summary, detail);
    };

    if (this.recipe && this.editMode) { // UPDATE
      // Check if recipe name has changed before making the call
      if (data.name !== this.recipe.name) {
        this.recipeService.checkRecipeName(data.name).subscribe({
          next: (result: boolean) => {
            if (!result) {
              this.recipeService.updateRecipe(this.recipe!._id, data).subscribe({
                next: handleRecipeUpdate,
                error: handleError,
              });
            } else {
              severity = 'error';
              summary = 'Erreur !';
              detail = `${data.name} existe`;
              this.showAndResetMessage(severity, summary, detail);
            }
          },
          error: handleError
        });
      } else {
        // If the name hasn't changed, directly update the recipe
        this.recipeService.updateRecipe(this.recipe!._id, data).subscribe({
          next: handleRecipeUpdate,
          error: handleError,
        });
      }
    } else {  // CREATE
      this.recipeService.checkRecipeName(data.name).subscribe({
        next: (result: boolean) => {
          if (!result) {
            this.recipeService.createRecipe(data).subscribe({
              next: (result: Recipe | undefined) => {
                if (result) {
                  this.recipes.push(result);
                  this.recipeSaved = true;
                  this.recipeDialog = false;
                  this.recipe = null;
                }
              },
              error: (err) => console.log(err),
              complete: () => this.showAndResetMessage(severity, summary, detail)
            });
          } else {
            severity = 'error';
            summary = 'Erreur !';
            detail = `${data.name} existe`;
            this.showAndResetMessage(severity, summary, detail);
          }
        },
        error: handleError,
      });
    }
  }

  /*** View detail click ***/
  detail(recipe: Recipe) {
    this.route.navigateByUrl(`/recipes/${recipe._id}`);
  }

  /*** Create recipe ***/
  createRecipe() {
    this.recipe = new Recipe();
    this.recipeDialog = true;
    this.editMode = false;
  }

  /*** Delete recipes (after confirm) ***/
  deleteSelectedRecipes() {

    if (this.selectedRecipes) {
      const deleteRequests = this.selectedRecipes.map(recipe => {
        return this.recipeService.deleteRecipeById(recipe._id);
      });

      forkJoin(deleteRequests).subscribe(
        {
          next:
            (results) => {
              // Check for errors in the results
              let listIdNotDeleted = results.filter(el => el?.error);

              // Find the index of all elements with a value of null (recipe deleted)
              const indexesDeletedSuccess = results.reduce((indexes, element, index) => {
                if (element === null) {
                  indexes.push(index);
                }
                return indexes;
              }, []);

              const listDeletedSuccess = indexesDeletedSuccess.map((el: number) => this.selectedRecipes![el]);
              const hasError = listIdNotDeleted.length > 0;

              // Products deleted success
              if (listDeletedSuccess.length > 0) {
                const listRecipesDeletedSuccess = listDeletedSuccess.map((el: Recipe) => el.name);

                // Update recipes list after delete
                const newList = this.recipes.filter(
                  (recipe: Recipe) => listDeletedSuccess.every(
                    (filterItem: Recipe) => filterItem._id !== recipe._id)
                );
                this.recipes = newList;

                this.messageService.add({
                  severity: `success`,
                  summary: 'Félicitation !',
                  detail: `Suppression des produits ${JSON.stringify(listRecipesDeletedSuccess)} est réalisée !`,
                  life: 3000
                });
              }

              // Products deleted with error
              if (hasError) {
                const listProdNotDeleted = this.recipes
                  .filter(recipe =>
                    listIdNotDeleted.some(el => el.id === recipe._id)
                  ).map(recipe => recipe.name);

                this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: `Une erreur survenue lors de la suppression avec les produits ${JSON.stringify(listProdNotDeleted)} !`,
                  life: 3000
                });
              }

              // Reset selected recipes
              this.selectedRecipes = null;
            }
        }
      );
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les produits sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSelectedRecipes();
      }
    });
  }

  /*** Create recipes selected list***/
  handleCreateRecipesList() {
    this.recipesListDialog = true;
  }

  recipesListEvent(event: any) {
    this.recipesListDialog = false;
    this.selectedRecipes = null;
  }
}
