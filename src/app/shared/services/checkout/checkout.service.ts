import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ICustomCheckOut, ICustomCheckOut_WithAuth, IGiftCode, INormalCheckOut, INormalCheckOut_WithAuth } from '../../interfaces/checkout';
import { ICheckOutPriceResponse, IDefaultResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private _ApiService:ApiService
  ) { }

  applyGiftCode(code:IGiftCode): Observable<ICheckOutPriceResponse> {
    return this._ApiService.postReq('giftCode', code);
  }

  getCustomCheckOut_WithOutAuth(subData:ICustomCheckOut): Observable<IDefaultResponse> {
    return this._ApiService.postReq('customCheckOutWithOutAuth', subData);
  }

  getCustomCheckOut_WithAuth(subData:ICustomCheckOut_WithAuth): Observable<IDefaultResponse> {
    return this._ApiService.postReq('customCheckOutWithAuth', subData);
  }

  getNormalCheckOut_WithOutAuth(subData:INormalCheckOut): Observable<IDefaultResponse> {
    return this._ApiService.postReq('checkOutWithOutAuth', subData);
  }

  getNormalCheckOut_WithAuth(subData:INormalCheckOut_WithAuth): Observable<IDefaultResponse> {
    return this._ApiService.postReq('checkOutWithAuth', subData);
  }

}
