import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { ProductModule } from './product/product.module';
import { RecipeModule } from './recipe/recipe.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { HomeModule } from './home/home.module';
import { ThemeService } from './theme.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    HomeModule,
    ProductModule,
    RecipeModule,
    ShoppingListModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false }),
    MenubarModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
