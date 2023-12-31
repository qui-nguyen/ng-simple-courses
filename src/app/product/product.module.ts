import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';


import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductComponent } from './product.component';
import { CategoryBadgePipe } from '../pipe/category-badge.pipe';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { WindowResizeDirective } from '../directive/window-resize.directive';
import { authGuard } from '../auth.guard';

const productRoutes: Routes = [
  {
    path: 'product', component: ProductComponent,
    pathMatch: 'full',
    title: 'Mes produits en stock',
    canActivate: [authGuard()]
  }
];

@NgModule({
  declarations: [
    ProductComponent,
    CategoryBadgePipe,
    ProductModalComponent,
    WindowResizeDirective
  ],
  imports: [
    CommonModule,
    TableModule,
    ChipModule,
    InputSwitchModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    RouterModule.forChild(productRoutes)
  ],
})
export class ProductModule { }
