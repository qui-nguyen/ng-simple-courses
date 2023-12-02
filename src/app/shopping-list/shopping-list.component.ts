import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  data: any;
  constructor(private shopListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shopListService.getShopList().subscribe(res => this.data = res)
  }
}
