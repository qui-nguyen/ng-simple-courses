import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ShoppingListComponent } from './shopping-list.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { ShoppingListModalComponent } from './shopping-list-modal/shopping-list-modal.component';


import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';


const shoppingListRoutes: Routes = [
  { path: 'shopping-list/recipes', component: RecipeListComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    RecipeListComponent,
    ShoppingListModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    DividerModule,
    ButtonModule,
    DataViewModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule,
    InputNumberModule,
    AutoCompleteModule,
    InputTextModule,
    RouterModule.forChild(shoppingListRoutes)
  ]
})
export class ShoppingListModule { }
