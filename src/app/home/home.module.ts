import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { ChartModule } from 'primeng/chart';
import { authGuard } from '../auth.guard';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: "Page d'acceuil",
    canActivate: [authGuard()]
  }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    RouterModule.forChild(homeRoutes)
  ]
})
export class HomeModule { }
