import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IGiftCode_menu } from '../../interfaces/checkout';
import { IMenuResponse } from '../../interfaces/HttpResponse';
import { ICart } from '../../interfaces/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private _ApiService: ApiService) {}
  shoppingCartItems: BehaviorSubject<any> = new BehaviorSubject(null);

  getMenu(): Observable<IMenuResponse> {
    return this._ApiService.postReq('getMenuNew', '');
  }

  getShoppingCart(): Observable<any> {
    return this._ApiService.postReq('myCartAuth', '');
  }

  addToShoppingCart(items: ICart): Observable<any> {
    return this._ApiService.postReq('addToCartAuth', items);
  }

  removeFromCart(cart_item_id: number): Observable<any> {
    return this._ApiService.postReq('removeFromCartAuth', { cart_item_id });
  }

  updateShoppingCart(items: any): Observable<any> {
    return this._ApiService.postReq('updateCartAuth', items);
  }

  checkoutWithAuth(receipt: any): Observable<any> {
    return this._ApiService.postReq('checkOutCartAuth', receipt);
  }

  checkoutWithoutAuth(receipt: any): Observable<any> {
    return this._ApiService.postReq('checkOutCart', receipt);
  }

  giftcode(code: IGiftCode_menu): Observable<any> {
    return this._ApiService.postReq('giftCodeMenu', code);
  }

  giftcode_WithoutErrNotify(code: IGiftCode_menu): Observable<any> {
    return this._ApiService.postReq_WithoutErrNotify('giftCodeMenu', code);
  }
}
