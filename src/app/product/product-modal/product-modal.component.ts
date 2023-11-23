import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Category, Product } from '../../type';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent implements OnInit {
  @Input() product!: Product;
  @Input() productDialog!: boolean;
  @Input() editMode!: boolean;
  @Input() productSaved!: boolean;
  @Input() categories!: Category[];
  @Output() productDialogEvent = new EventEmitter<boolean>();
  @Output() productSavedEvent = new EventEmitter<boolean>();

  _formGroup: FormGroup | undefined;
  newProduct: Product = new Product();
  listCategoriesName: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    this.listCategoriesName = this.categories.map(el => el.name);

    if (!this.editMode) {
      this.product = this.newProduct
    }

    this._formGroup = this.formBuilder.group({
      name: [this.product.name, Validators.required],
      category: [this.product.category.name, Validators.required],
      quantity: [this.product.quantity, Validators.required],
      status: [this.product.status, Validators.required],
    })
  }

  hideDialog() {
    this.productDialogEvent.emit(false);
  }

  saveProduct() {
    if (this._formGroup && this.categories && this._formGroup.valid) {
      if (this.editMode) {
        console.log(this._formGroup.value);
        this.productService.updateProduct(
          {
            ...this._formGroup.value,
            category: this.categories.find(
              (el: Category) => el.name === this._formGroup!.value.category)!._id,
            _id: this.product._id,
            createdDate: new Date()
          }
        ).subscribe(
          (res) => {
            if (res !== undefined) {
              this.productDialogEvent.emit(false);
              this.productSavedEvent.emit(true);
            }
          }
        );
      } else {
        this.productService.createProduct(
          {
            ...this._formGroup.value,
            category: this.categories.find(
              (el: Category) => el.name === this._formGroup!.value.category)!._id,
            createdDate: new Date()
          }
        ).subscribe(
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
