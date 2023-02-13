import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMealDetails2 } from 'src/app/shared/interfaces/menu';
import { LocalService } from 'src/app/shared/services/local.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  shoppingCartItems: IMealDetails2[] = [];
  isLoggedIn: boolean = false;
  constructor(
    private _MenuService: MenuService,
    private _Router: Router,
    private _LocalService: LocalService
  ) {}

  ngOnInit(): void {
    this.shoppingCartItems = this._MenuService.shoppingCartItems.value;
    if (this.shoppingCartItems == null || !this.shoppingCartItems.length) {
      this._Router.navigate(['/home']);
    }
    if (this._LocalService.getJsonValue('userInfo') != null) {
      this.isLoggedIn = true;
    }
  }

  removeFromCart(id: number) {
    this._MenuService.removeFromCart(id).subscribe({
      next: (res) => {
        this.shoppingCartItems = this.shoppingCartItems.filter(function (item) {
          return item.cart_id !== id;
        });
      },
    });
  }

  removeFromCart_WithoutAuth(id: number) {
    this.shoppingCartItems = this.shoppingCartItems.filter(function (item) {
      return item.id !== id;
    });
    this.saveShoppingCartInSession();
  }

  getCheckout() {
    this._MenuService.shoppingCartItems.next(this.shoppingCartItems);
    this._Router.navigate(['/menu/checkout']);
  }

  saveShoppingCartInSession() {
    sessionStorage.setItem(
      'cartDetails',
      JSON.stringify(this.shoppingCartItems)
    );
  }
}
