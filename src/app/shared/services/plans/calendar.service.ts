// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private _ApiService:ApiService,
    // private http:HttpClient,
  ) { }

  currentCid:BehaviorSubject<string> = new BehaviorSubject('');
  planStatus:BehaviorSubject<string> = new BehaviorSubject('');

  // getPlanDetails(cid:string): Observable<any>{
  //   return this.http.get(environment.BaseUrl2 + `Subscription/GetSubscription?CID=${cid}`)
  // }
  // getNutirations(cid:string): Observable<any>{
  //   return this.http.get(environment.BaseUrl2 + `Subscription/GetNutirations2?CID=${cid}`)
  // }

  getPlanDetails(cid:string): Observable<any>{
    return this._ApiService.postReq('getPlanDetails', {cid:cid});
  }
  // getNutirations(cid:string): Observable<any>{
  //   return this.http.get(environment.BaseUrl2 + `Subscription/GetNutirations2?CID=${cid}`)
  // }

  // TODO: change type any
  // TODO: move this file to profile services
}
