import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Category, Product, ProductBody, ProductBrut } from '../../type';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent implements OnInit {
  @Input() productsBrut!: ProductBrut[];
  @Input() product!: Product;
  @Input() productDialog!: boolean;
  @Input() editMode!: boolean;
  @Input() productSaved!: boolean;
  @Input() categories!: Category[];
  @Output() productDialogEvent = new EventEmitter<boolean>();
  @Output() productSavedEvent = new EventEmitter<boolean>();

  _formGroup: FormGroup | undefined;
  newProduct: Product = new Product;

  listCategoriesName: string[] = [];
  selectedCategoryName: string | undefined = undefined;

  selectedProduct: ProductBrut | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    this.listCategoriesName = this.categories.map(el => el.name);

    if (!this.editMode) {
      this.product = this.newProduct;
    }

    this.selectedProduct = this.product.productBrut;
    this.selectedCategoryName = this.product.category?.name;

    this._formGroup = this.formBuilder.group({
      name: [this.product.productBrut, Validators.required],
      category: [this.product.category?.name],
      quantity: [this.product.quantity, Validators.required],
      unit: [this.product.unit, Validators.required],
      status: [this.product.status, Validators.required],
    })
  }

  getName(event: DropdownChangeEvent) {
    this.selectedProduct = event.value;
  }

  getCatName(event: DropdownChangeEvent) {
    this.selectedCategoryName = event.value;
  }

  hideDialog() {
    this.productDialogEvent.emit(false);
  }

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
