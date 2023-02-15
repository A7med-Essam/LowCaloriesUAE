import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IMealDetails2 } from 'src/app/shared/interfaces/menu';
import { LocalService } from 'src/app/shared/services/local.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { ICart } from '../../../shared/interfaces/menu';

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
    private _I18nService: I18nService,
    private _ToastrService: ToastrService,
    public translate: TranslateService,
    private _Router: Router,
    private _LocalService: LocalService
  ) {
    this._I18nService.saveCurrentLang(this.translate);
  }

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

  shoppingCartAddedSuccessfully_Notify() {
    if (this.translate.currentLang == 'ar') {
      this._ToastrService.success('تمت إضافة الوجبة بنجاح', 'السلة', {
        timeOut: 3000,
      });
    } else {
      this._ToastrService.success('Meal added successfully', 'Shopping Cart', {
        timeOut: 3000,
      });
    }
  }

  shoppingCartRemovedSuccessfully_Notify() {
    if (this.translate.currentLang == 'ar') {
      this._ToastrService.success('تم إزالة الوجبة بنجاح', 'السلة', {
        timeOut: 3000,
      });
    } else {
      this._ToastrService.success(
        'Meal removed successfully',
        'Shopping Cart',
        {
          timeOut: 3000,
        }
      );
    }
  }

  addItemsToCart_WithoutAuth(meal: IMealDetails2) {
    let item = this.shoppingCartItems.find((item) => item == meal);
    if (item) {
      if (item.count) {
        item.count++;
        this.saveShoppingCartInSession();
        this.shoppingCartAddedSuccessfully_Notify();
      }
    }
  }

  removeItemsFromCart_WithoutAuth(meal: IMealDetails2) {
    let item = this.shoppingCartItems.find((item) => item == meal);
    if (item) {
      if (item.count && item.count >= 2) {
        item.count--;
        this.saveShoppingCartInSession();
        this.shoppingCartRemovedSuccessfully_Notify();
      }
    }
  }

  removeItemsFromCart_WithAuth(meal: IMealDetails2) {
    let item = this.shoppingCartItems.find((item) => item == meal);
    if (item) {
      if (item.count && item.count >= 2) {
        item.count--;
        this.updateShoppingCart(item);
      }
    }
  }

  addItemsToCart_WithAuth(meal: IMealDetails2) {
    let item = this.shoppingCartItems.find((item) => item == meal);
    if (item) {
      if (item.count) {
        item.count++;
        this.updateShoppingCart(item);
      }
    }
  }

  updateShoppingCart(item: any) {
    const CART = {
      cart_item_id: item.cart_id,
      count: item.count,
      unit: item.unit,
      gram_pcs_count: item.gram_pcs_count,
      total_price: item.price,
    };
    this._MenuService.updateShoppingCart(CART).subscribe();
  }
}
