import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Observable } from 'rxjs';
import { IClinicDatesResponse, IClinicResponse, IDefaultResponse } from '../../interfaces/HttpResponse';
import { IClinicCheckOutSubInfo } from '../../interfaces/checkout';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getEmiratesForOnline(): Observable<IClinicResponse> {
    return this._ApiService.postReq('getEmiratesForOnline','');
  }

  getDates(Dates:string[]): Observable<IClinicDatesResponse> {
    return this._ApiService.postReq('dates_locked_unlocked_clinic', {myDates:Dates});
  }

  getClinicCheckOut(SubInfo:IClinicCheckOutSubInfo): Observable<IDefaultResponse> {
    return this._ApiService.postReq('checkOutClinicOnline',SubInfo);
  }

}
