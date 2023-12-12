import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { ChartModule } from 'primeng/chart';

const homeRoutes: Routes = [
  { path: '', component: HomeComponent }
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
