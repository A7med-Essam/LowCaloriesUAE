import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IAddressResponse, IAreasResponse, IEmirateResponse } from '../../interfaces/HttpResponse';
import { ICreateAddress, IUpdateAddress } from '../../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor
  (
      private _ApiService:ApiService
  ) { }

  getEmirates(): Observable<IEmirateResponse> {
      return this._ApiService.getReq('emirates');
  }

  getAreas(emirate_id:number): Observable<IAreasResponse> {
    return this._ApiService.postReq('areas',emirate_id);
  }

  getAddresses(): Observable<IAddressResponse> {
    return this._ApiService.postReq('addresses','');
  }

  deleteAddress(address_id:number): Observable<IAddressResponse> {
    return this._ApiService.postReq('deleteAddresses',{"address_id":address_id});
  }

  createAddress(address_info:ICreateAddress): Observable<IAddressResponse> {
    return this._ApiService.postReq('createAddresses', address_info);
  }

  updateAddress(address_info:IUpdateAddress): Observable<IAddressResponse> {
    return this._ApiService.postReq('updateAddresses', address_info);
  }
}