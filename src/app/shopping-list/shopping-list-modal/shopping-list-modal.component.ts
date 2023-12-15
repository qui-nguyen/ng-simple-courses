import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ProductBrutService } from 'src/app/services/product-brut.service';
import {IngredientShopList, ProductBrut, ShoppingList } from 'src/app/type';

@Component({
  selector: 'app-shopping-list-modal',
  templateUrl: './shopping-list-modal.component.html'
})
export class ShoppingListModalComponent implements OnInit {
  /*** Input properties to receive data from shoppping list component ***/
  @Input() shopList: ShoppingList | null;
  @Input() shopListDialog = false;
  @Input() editMode: boolean;
  @Input() haveRecipesList: boolean;


  /*** Output property to emit events to shoppping list component ***/
  @Output() shopListEvent = new EventEmitter<any>();
  @Output() shopListDialogEvent = new EventEmitter<boolean>();

  _shopListFormGroup: FormGroup | undefined;
  searchProductsBrutList!: ProductBrut[];
  searchTerms = new Subject<string>();

  constructor(
    private productBrutService: ProductBrutService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('shopList' in changes && this.shopList) {
      this._shopListFormGroup = this.formBuilder.group({
        name: new FormControl(this.shopList?.name || '', [Validators.required]),
        ingredients: this.formBuilder.array(
          this.shopList?.shopListCustomize?.map(
            (ingredient, i) => this.createIngredientFormGroup(ingredient, i)
          ) || [], [Validators.required]),
      });
    }
  }

  ngOnInit(): void {
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
    return this._shopListFormGroup?.get('ingredients') as FormArray;
  }

  createIngredientFormGroup(ingredient: IngredientShopList, i: number): FormGroup {
    return this.formBuilder.group({
      [`productBrut`]: [{ _id: ingredient.productBrutId, alim_nom_fr: ingredient.alim_nom_fr }, Validators.required],
      [`quantity`]: [ingredient.quantity, Validators.required],
      [`unit`]: [ingredient.unit, Validators.required],
    });
  }

  addNewIngredient() {
    this.searchTerms.next(''); // reset search
    const newIngredientFormGroup = this.createIngredientFormGroup(
      {
        _id: '',
        productBrutId: '',
        alim_nom_fr: '',
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
    this.shopListDialogEvent.emit(false);
  }

  saveShopList() {
    this.shopListEvent.emit(this._shopListFormGroup?.value);
  }
}
