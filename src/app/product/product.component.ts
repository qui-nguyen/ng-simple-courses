
import { Component, OnInit } from '@angular/core';
import { Category, Product, ProductBrut } from '../type';

import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ProductBrutService } from '../services/product-brut.service';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class ProductComponent implements OnInit {
    // productsBrut: ProductBrut[]; // all products brut
    products: Product[]; // all products
    categories: Category[]; // all categories

    product: Product | null = null;
    productDialog: boolean = false; // open or close product-modal
    editMode: boolean = false; // edit or create product
    productSaved: boolean = false; // is product saved successfully

    selectedProducts: Product[] | null = null; // list products selected

    firstDay: Date = new Date();
    lastDay: Date = new Date();

    isError: boolean = false;
    messages: string = '';

    isMediumScreenUp: boolean = window.innerWidth > 821;

    constructor(
        private productBrutService: ProductBrutService,
        private productService: ProductService,
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {

        /*** Get all categories and products ***/
        this.categoryService.getCategories().subscribe(
            {
                next: (result) => {
                    this.categories = result;
                },
                error: (err) => { console.log(err); },
                complete: () => { this.getAllProducts(); }
            }
        );


        /*** Get current week ***/
        const today = new Date();
        this.firstDay = new Date(
            today.setDate(today.getDate() - today.getDay() + 1),
        );
        this.lastDay = new Date(
            today.setDate(today.getDate() - today.getDay() + 6),
        );


    }

    /*** Get responsive breakpoint state emit from directive ***/
    onWindowResize(isMediumScreenUp: boolean): void {
        this.isMediumScreenUp = isMediumScreenUp;
    }

    /*** Get all products ***/
    getAllProducts() {
        this.productService
            .getProducts()
            .subscribe((products: Product[]) => this.products = products);
    }

    /*** Product selected ***/
    selectedProduct(product: Product) {}

    /*** Delete products (after confirm) ***/
    deleteSelectedProducts() {

        if (this.selectedProducts) {
            const deleteRequests = this.selectedProducts.map(product => {
                return this.productService.deleteProductById(product._id);
            });

            /*** When you want to delete a list of products and stop the deletion process if an error occurs,
           * you can use the forkJoin operator from RxJS
           * The forkJoin operator allows you to execute multiple Observables in parallel and emit a single value 
           * when all of them complete.
           * ***/

            forkJoin(deleteRequests).subscribe(
                {
                    next:
                        (results) => {
                            // Check for errors in the results
                            let listIdNotDeleted = results.filter(el => el?.error);
                            // let listIdDeletedSuccess = results.filter(el => el === null);

                            // Find the index of all elements with a value of null (recipe deleted)
                            const indexesDeletedSuccess = results.reduce((indexes, element, index) => {
                                if (element === null) {
                                    indexes.push(index);
                                }
                                return indexes;
                            }, []);

                            const listDeletedSuccess = indexesDeletedSuccess.map((el: number) => this.selectedProducts![el]);

                            const hasError = listIdNotDeleted.length > 0;


                            // Products deleted success
                            if (listDeletedSuccess.length > 0) {
                                const listProdDeletedSuccess = listDeletedSuccess.map(
                                    (prod: Product) => prod.productBrut.alim_nom_fr);
                                    
                                this.messages = `Suppression des produits ${JSON.stringify(listProdDeletedSuccess)} est réalisée !`;

                                this.messageService.add({
                                    severity: `${this.isError ? 'error' : 'success'}`,
                                    summary: this.messages,
                                    detail: '',
                                    life: 3000
                                });
                            }

                            // Products deleted with error
                            if (hasError) {
                                this.isError = true;
                                const listProdNotDeleted = this.products
                                    .filter(prod =>
                                        listIdNotDeleted.some(el => el.id === prod._id)
                                    ).map(prod =>
                                        prod.productBrut.alim_nom_fr);
                                this.messages = `Une erreur survenue lors de la suppression avec les produits ${JSON.stringify(listProdNotDeleted)} !`;

                                this.messageService.add({
                                    severity: `${this.isError ? 'error' : 'success'}`,
                                    summary: this.messages,
                                    detail: '',
                                    life: 3000
                                });
                            }

                            // Reset products list
                            this.getAllProducts();

                            // Reset selected products
                            this.selectedProducts = null;
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
                this.deleteSelectedProducts();
                this.isError = false;
            }
        });
    }

    /*** Edit product click => open modal; set edit mode; fill product to modal ***/
    editProduct(product: Product) {
        this.productDialog = true;
        this.editMode = true;
        this.product = product;
    }

    /*** Edit product click => open modal; set edit mode to false; fill new product (init) to modal ***/
    createProduct() {
        this.productDialog = true;
        this.editMode = false;
        this.product = new Product;
    }

    /*** Event capted from modal (child) 
     * => transfert state of modal (open or close) 
     * => update state of modal in parent 
     * => retransfert this state to child ***/
    isProductDialogOpen(isOpen: boolean) {
        if (!isOpen) {
            this.product = null;
        }
        this.productDialog = isOpen;
    }

    /*** Event capted from modal (child) 
    * => product saved succes or not 
    * => update state in parent 
    * => retransfert this state to child ***/
    isProductSaved(saved: boolean) {
        if (saved) {
            if (this.editMode) {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Produit modifié', life: 3000 });
            } else {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Nouveau produit créé', life: 3000 });
            }
        } else {
            if (this.editMode) {
                this.messageService.add({ severity: 'danger', summary: 'Une erreur survenue', detail: 'Produit ne peut pas être modifié', life: 3000 });
            } else {
                this.messageService.add({ severity: 'danger', summary: 'Une erreur survenue', detail: 'Erreur lors de la création du nouveau produit', life: 3000 });
            }
        }
        this.getAllProducts();
        this.productSaved = false;
    }
}
