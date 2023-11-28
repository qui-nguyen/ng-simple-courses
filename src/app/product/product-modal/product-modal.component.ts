import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Category, Product, ProductBody, ProductBrut } from '../../type';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ProductBrutService } from 'src/app/services/product-brut.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent implements OnInit, AfterViewChecked {
  @Input() productsBrut!: ProductBrut[];
  @Input() product!: Product;
  @Input() productDialog!: boolean;
  @Input() editMode!: boolean;
  @Input() productSaved!: boolean;
  @Input() categories!: Category[];
  @Output() productDialogEvent = new EventEmitter<boolean>();
  @Output() productSavedEvent = new EventEmitter<boolean>();

  isMediumScreenUp: boolean = window.innerWidth > 821;

  _formGroup: FormGroup | undefined;
  newProduct: Product = new Product;

  listCategoriesName: string[] = [];
  selectedCategoryName: string | undefined = undefined;

  selectedProduct: ProductBrut | undefined = undefined;

  searchProductsBrutList: ProductBrut[] = [];
  searchTerms = new Subject<string>(); // rôle: stocker des recherches successibles de l'utilsateur 
  // => but: créer un flux dans le temps des recherches sous form string[]
  // (new Subject : permettre piloter Observable)

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private productBrutService: ProductBrutService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.listCategoriesName = this.categories.map(el => el.name);

    if (!this.editMode) {
      this.product = this.newProduct;
    }

    this.selectedProduct = this.product.productBrut;
    this.selectedCategoryName = this.product.category?.name;

    this.searchTerms.pipe(
      debounceTime(300), // => prendre que les terms avec le temps de typage est supérieur à 500ms après
      distinctUntilChanged(), // => prendre les valeurs uniques
      switchMap(term => this.productBrutService.getProductsByName(term)), // garder que la dernière et supprimer les autres observables (même en cours) => économiser les ressources 
    ).subscribe(res => this.searchProductsBrutList = res);

    this._formGroup = this.formBuilder.group({
      name: [this.product.productBrut, Validators.required],
      category: [this.product.category?.name],
      quantity: [this.product.quantity, Validators.required],
      unit: [this.product.unit, Validators.required],
      status: [this.product.status, Validators.required],
    });

    this.isMediumScreenUp = window.innerWidth > 821;
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  /*** Get responsive breakpoint state emit from directive ***/
  onWindowResize(isMediumScreenUp: boolean): void {
    this.isMediumScreenUp = isMediumScreenUp;
  }

  /*** Search product brut by name (autocomplete input) ***/
  searchName(event: AutoCompleteCompleteEvent) {
    this.searchTerms.next(event.query);
  }

  /*** Select name of product brut from dropdown filter (prev ui) ***/
  getName(event: DropdownChangeEvent) {
    this.selectedProduct = event.value;
  }

  /*** Select name of category from dropdown ***/
  getCatName(event: DropdownChangeEvent) {
    this.selectedCategoryName = event.value;
  }

  /*** Emit signal to parent (on Annuler (Close) click) ***/
  hideDialog() {
    this.productDialogEvent.emit(false);
  }

  /*** Save prod and Emit signal to parent (close if ok /still open if error) ***/
  saveProduct() {
    if (this._formGroup && this.categories && this._formGroup.valid) {
      const newProduct: ProductBody = {
        productBrutId: this._formGroup.value.name._id,
        categoryId: this.categories.find(
          (el: Category) => el.name === this._formGroup!.value.category)?._id || null,
        quantity: this._formGroup.value.quantity,
        unit: this._formGroup.value.unit,
        status: this._formGroup.value.status,
        createdDate: new Date()
      }

      if (this.editMode) {
        this.productService
          .updateProduct(this.product._id, newProduct).subscribe(
            (res) => {
              if (res !== undefined) {
                this.productDialogEvent.emit(false);
                this.productSavedEvent.emit(true);
              }
            }
          );
      } else {
        this.productService.createProduct(newProduct).subscribe(
          (res) => {
            if (res !== undefined) {
              this.productDialogEvent.emit(false);
              this.productSavedEvent.emit(true);
            }
          }
        );
      }
    }
  }
}
