import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ShoppingListComponent implements OnInit {
  ngOnInit(): void {}
}
