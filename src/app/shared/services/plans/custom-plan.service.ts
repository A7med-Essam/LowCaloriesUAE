import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'src/app/core/services/api.service';
import { ISubscribtionDetails } from '../../interfaces/customPlan';
import { ICardsOfDatesResponse, ICategoriesResponse, ICustomProgramsDetailsResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class CustomPlanService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getCustomProgramDetails(program_id:number): Observable<ICustomProgramsDetailsResponse> {
    return this._ApiService.postReq('custom_program_details', program_id);
  }

  getCardsOfDates(SubscribtionDetails:ISubscribtionDetails): Observable<ICardsOfDatesResponse> {
    return this._ApiService.postReq('cards_of_dates', SubscribtionDetails);
  }

  getCategories_with_meals(program_id:number): Observable<ICategoriesResponse> {
    return this._ApiService.postReq('categories_with_meals_test', program_id);
  }
}