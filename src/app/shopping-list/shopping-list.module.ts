import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';

import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';



const shoppingListRoutes: Routes = [
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  declarations: [
    ShoppingListComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    DividerModule,
    RouterModule.forChild(shoppingListRoutes)
  ]
})
export class ShoppingListModule { }
