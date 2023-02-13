import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'src/app/core/services/api.service';
import { ICheckOutPriceResponse, INormalProgramDetailsResponse, IProgramMealsResponse } from '../../interfaces/HttpResponse';
import {  INormalProgramDetails, IProgramMeals, IProgramPrice, ISubscriptionData_NormalPlan } from '../../interfaces/normalPlan';

@Injectable({
  providedIn: 'root'
})
export class NormalPlanService {
  CurrentMeals:BehaviorSubject<IProgramMeals | any> = new BehaviorSubject(null);
  SubscriptionData:BehaviorSubject<ISubscriptionData_NormalPlan | any> = new BehaviorSubject(null);
  ProgramDetails:BehaviorSubject<INormalProgramDetails | any> = new BehaviorSubject(null);

  constructor(
    private _ApiService:ApiService,
  ) { }

  getMeals(SubscriptionForm:ISubscriptionData_NormalPlan): Observable<IProgramMealsResponse> {
    return this._ApiService.postReq('show_Meals',SubscriptionForm);
  }

  getNormalProgramDetails(program_id:number): Observable<INormalProgramDetailsResponse> {
    return this._ApiService.postReq('program_details', program_id);
  }

  getProgramPrice(data:IProgramPrice) : Observable<ICheckOutPriceResponse>{
    return this._ApiService.postReq('program_prices', data);
  }


  SaveCurrentMeals(normalPlan_meals:IProgramMeals[]){
    this.CurrentMeals.next(normalPlan_meals);
  }

  SaveSubData(SubData:ISubscriptionData_NormalPlan){
    this.SubscriptionData.next(SubData);
  }
}
