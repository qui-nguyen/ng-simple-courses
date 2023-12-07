import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Recipe, RecipeBody } from '../type';
import { RecipeService } from '../services/recipe.service';
import { forkJoin, of, switchMap } from 'rxjs';
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
  recipeListDialog: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
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

  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }

  getNewRecipeData(data: RecipeBody) {

    const showMessageByMode = (editMode: boolean, result: Recipe | undefined | null) => {
      let detailText = `${result
        ? (editMode
          ? 'Recette est modifiée'
          : 'Nouvelle recette ajoutée !')
        : (result === null
          ? 'Ce nom appartient à une autre recette !'
          : (editMode
            ? 'Une erreur survenue lors de la création !'
            : 'Une erreur survenue lors de la mise à jour de la recette !')
        )
        }`

      this.showMessage(
        `${result ? 'success' : 'error'}`,
        `${result ? 'Félicitation' : 'Erreur'}`,
        detailText
      );
    }

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

    const handleRecipeUpdate = (result: Recipe | undefined | null) => {
      if (result) {
        const indexFounded = this.recipes.findIndex((el: Recipe) => el._id === result._id);
        this.recipes[indexFounded] = result;
        this.recipeSaved = true;
        this.recipe = null;
        this.recipeDialog = false;
        this.selectedRecipes = updateRecipeSelected(result, this.selectedRecipes);
      }
      showMessageByMode(true, result);
    };

    // UPDATE
    if (this.recipe && this.editMode) {
      // Check if recipe name has changed before making the call
      if (data.name !== this.recipe.name) {
        this.recipeService.checkRecipeName(data.name).pipe(
          switchMap(isExist => {
            if (isExist) { return of(null) }
            else {
              return this.recipeService.updateRecipe(this.recipe!._id, data);
            }
          })
        ).subscribe(
          res => handleRecipeUpdate(res)
        )
      } else {        // If the name hasn't changed, directly update the recipe
        this.recipeService.updateRecipe(this.recipe!._id, data).subscribe(res => handleRecipeUpdate(res));
      }
    }

    // CREATE
    if (!this.editMode) {
      this.recipeService.checkRecipeName(data.name).pipe(
        switchMap(isExist => {
          if (isExist) { return of(null) }
          else {
            return this.recipeService.createRecipe(data);
          }
        })
      ).subscribe(
        res => {
          if (res) {
            this.recipes.unshift(res);
            this.recipeSaved = true;
            this.recipeDialog = false;
          };
          showMessageByMode(false, res);
        }
      )
    }
  }

  /*** View detail click ***/
  detail(recipe: Recipe) {
    this.router.navigateByUrl(`/recipes/${recipe._id}`);
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
                this.showMessage('success', 'Félicitation !',
                  `Suppression des produits ${JSON.stringify(listRecipesDeletedSuccess)} est réalisée !`
                )
              }

              // Products deleted with error
              if (hasError) {
                const listProdNotDeleted = this.recipes
                  .filter(recipe =>
                    listIdNotDeleted.some(el => el.id === recipe._id)
                  ).map(recipe => recipe.name);

                this.showMessage('error', 'Erreur',
                  `Une erreur survenue lors de la suppression avec les produits ${JSON.stringify(listProdNotDeleted)} !`
                );
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
  handleCreateRecipeList() {
    this.recipeListDialog = true;
  }

  recipeListEvent(event: any) {
    this.recipeListDialog = false;
    this.selectedRecipes = [];
  }

  goToShopList() {
    this.router.navigateByUrl('/shopping-list');
  }
}
