import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { ShoppingListComponent } from './shopping-list.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';


import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';



const shoppingListRoutes: Routes = [
  { path: 'shopping-list/recipes', component: RecipeListComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    RecipeListComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    DividerModule,
    ButtonModule,
    RouterModule.forChild(shoppingListRoutes)
  ]
})
export class ShoppingListModule { }
