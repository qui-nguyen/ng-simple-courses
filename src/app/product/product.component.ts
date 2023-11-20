
import { Component, OnInit } from '@angular/core';
import { Category, Product } from '../type';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class ProductComponent implements OnInit {

    productDialog: boolean = false;

    products!: Product[];
    categories!: Category[];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    firstDay: Date = new Date();
    lastDay: Date = new Date();

    isError: boolean = false;
    messages: string = '';

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.categoryService.getCategories().subscribe((categories: Category[]) => this.categories = categories);

        this.productService.getProducts().subscribe((products: Product[]) => {
            this.products = products.map((p: Product) => {
                return {
                    ...p,
                    categoryName: this.categories.find((c: Category) => c.id === p.category)?.name || 'Autre',
                    statusName: p.status ? 'Reste' : ''
                }
            })
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        const today = new Date();

        this.firstDay = new Date(
            today.setDate(today.getDate() - today.getDay() + 1),
        );

        this.lastDay = new Date(
            today.setDate(today.getDate() - today.getDay() + 6),
        );
    }

    // openNew() {
    //     this.product = {};
    //     this.submitted = false;
    //     this.productDialog = true;
    // }

    selectedProduct(product: Product) {
        // console.log(product);
    }

    deleteSelectedProducts() {
        console.log("Delete clicked ");

        if (this.selectedProducts) {
            const deleteRequests = this.selectedProducts.map(product => {
                return this.productService.deleteProductById(+(product.id));
            });

            // When you want to delete a list of products and stop the deletion process if an error occurs,
            // you can use the forkJoin operator from RxJS
            // The forkJoin operator allows you to execute multiple Observables in parallel and emit a single value 
            // when all of them complete.

            forkJoin(deleteRequests).subscribe(
                {
                    next:
                        (results) => {
                            // console.log('Deletion results:', results);

                            // Check for errors in the results
                            let listIdNotDeleted = results.filter(el => el?.error);
                            const hasError = listIdNotDeleted.length > 0;

                            // Reset selected products
                            this.selectedProducts = null;
                            this.messages = 'Suppression succès !';

                            if (hasError) {
                                this.isError = true;
                                const listProdNotDeleted = this.products
                                    .filter(prod =>
                                        listIdNotDeleted.some(el => el.id === prod.id)
                                    ).map(prod =>
                                        prod.name);
                                this.messages = `Une erreur survenue lors de la suppression avec les produits ${JSON.stringify(listProdNotDeleted)} !`;
                            }

                            // Reset products list
                            this.productService.getProducts().subscribe((products: Product[]) => {
                                this.products = products.map((p: Product) => {
                                    return {
                                        ...p,
                                        categoryName: this.categories.find((c: Category) => c.id === p.category)?.name || 'Autre',
                                        statusName: p.status ? 'Reste' : ''
                                    };
                                });
                            });

                            // Set the message and isError
                            this.messageService.add({
                                severity: `${this.isError ? 'error' : 'success'}`,
                                summary: this.messages,
                                detail: '',
                                life: 3000
                            });
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

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    // deleteProduct(product: Product) {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure you want to delete ' + product.name + '?',
    //         header: 'Confirm',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.products = this.products.filter((val) => val.id !== product.id);
    //             this.product = {};
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    //         }
    //     });
    // }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    // saveProduct() {
    //     this.submitted = true;

    //     if (this.product.name?.trim()) {
    //         if (this.product.id) {
    //             this.products[this.findIndexById(this.product.id)] = this.product;
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    //         } else {
    //             this.product.id = this.createId();
    //             this.product.image = 'product-placeholder.svg';
    //             this.products.push(this.product);
    //             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
    //         }

    //         this.products = [...this.products];
    //         this.productDialog = false;
    //         this.product = {};
    //     }
    // }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === +id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // getSeverity(status: string) {
    //     switch (status) {
    //         case 'INSTOCK':
    //             return 'success';
    //         case 'LOWSTOCK':
    //             return 'warning';
    //         case 'OUTOFSTOCK':
    //             return 'danger';
    //     }
    // }
}
