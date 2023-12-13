import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ProductBrutService } from 'src/app/services/product-brut.service';
import { IngredientRecipe, IngredientShopList, ProductBrut, Recipe, RecipeBody } from 'src/app/type';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
  providers: [MessageService]
})
export class RecipeModalComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() editMode!: boolean;

  @Input() recipeSaved!: boolean;
  @Input() recipeDialog!: boolean;

  @Output() recipeDialogEvent = new EventEmitter<boolean>();
  // @Output() recipeSavedEvent = new EventEmitter<boolean>();
  @Output() newRecipeDataEvent = new EventEmitter<RecipeBody>();

  _recipeFormGroup: FormGroup | undefined;
  searchProductsBrutList!: ProductBrut[];
  searchTerms = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productBrutService: ProductBrutService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    // this._recipeFormGroup = this.formBuilder.group({
    //   name: [this.recipe.name, Validators.required],
    //   ingredients: this.formBuilder.array(
    //     this.recipe.ingredients.map(
    //       (ingredient, i) => this.createIngredientFormGroup(ingredient, i)
    //     )),
    //   instruction: [this.recipe.instructions],
    //   image: [this.recipe.imageUrl]
    // });
    this._recipeFormGroup = this.formBuilder.group({
      name: new FormControl(this.recipe.name, [Validators.required]),
      ingredients: this.formBuilder.array(
        this.recipe.ingredients.map(
          (ingredient, i) => this.createIngredientFormGroup(ingredient, i)
        ), [Validators.required]),
      instruction: new FormControl(this.recipe.instructions),
      imageUrl: new FormControl(this.recipe.imageUrl)
    });

    // Pipe of search
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.productBrutService.getProductsByName(term)),
    ).subscribe(res => this.searchProductsBrutList = res);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  get ingredients(): FormArray {
    return this._recipeFormGroup?.get('ingredients') as FormArray;
  }

  createIngredientFormGroup(ingredient: IngredientRecipe, i: number): FormGroup {
    return this.formBuilder.group({
      [`productBrut`]: [ingredient.productBrut, Validators.required],
      [`quantity`]: [ingredient.quantity, Validators.required],
      [`unit`]: [ingredient.unit, Validators.required],
    });
  }

  addNewIngredient() {
    this.searchTerms.next(''); // reset search
    const newIngredientFormGroup = this.createIngredientFormGroup(
      {
        _id: '',
        productBrut: { alim_nom_fr: '', _id: '' },
        quantity: 0,
        unit: ''
      },
      this.ingredients.length);
    this.ingredients.push(newIngredientFormGroup);
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  searchProductName(event: AutoCompleteCompleteEvent) {
    this.searchTerms.next(event.query);
  }

  hideDialog() {
    this.recipeDialogEvent.emit(false);
  }

  saveRecipe() {
    let ingredientIdsList = [];
    const { ingredients } = this._recipeFormGroup?.value;

    // Case form invalid
    if (!this._recipeFormGroup?.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Remplissage obligatoire',
        detail: 'Veuillez remplir les champs obligatoires.',
        life: 3000
      });
    }

    // Transform ingredients list to ids list => conforme RecipeBody
    ingredientIdsList = ingredients.map((el: any) => {
      if (!el.productBrut._id) { // Product insert manually
        this.messageService.add({
          severity: 'error',
          summary: `${el.productBrut} non valide`,
          detail: 'Veuillez sélectionner un des produits dans la liste',
          life: 3000
        });
        return null;
      }
      const newEl = {
        ...el,
        productBrutId: el.productBrut._id,
        alim_nom_fr: el.productBrut.alim_nom_fr
      };
      delete newEl.productBrut;
      return newEl;
    });

    // Send data to parent
    if (!ingredientIdsList.some((el: any) => el === null)) { // Not found product insert manually
      this.newRecipeDataEvent.emit({
        ...this._recipeFormGroup?.value,
        ingredients: ingredientIdsList,
        createdDate: new Date()
      });
    }

  }
}
