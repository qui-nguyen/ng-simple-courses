import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RecipeComponent } from './recipe.component';


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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListModalComponent } from './recipe-list-modal/recipe-list-modal.component';
import { authGuard } from '../auth.guard';

// import { WindowResizeDirective } from '../directive/window-resize.directive';

const recipeRoutes: Routes = [
  {
    path: 'recipes',
    component: RecipeComponent,
    pathMatch: 'full',
    title: 'Mes recettes',
    canActivate: [authGuard()]
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailComponent,
    pathMatch: 'full',
    title: 'Ma recette',
    canActivate: [authGuard()]
  },
];

@NgModule({
  declarations: [
    RecipeComponent,
    RecipeModalComponent,
    RecipeDetailComponent,
    RecipeListModalComponent,
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
    InputTextareaModule,
    TabViewModule,
    DividerModule,
    RouterModule.forChild(recipeRoutes)
  ],
})
export class RecipeModule { }
