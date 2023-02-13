import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IBootResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class BotService {

    constructor(
      private _ApiService:ApiService
    ) { }
  
    getQuestions(): Observable<IBootResponse> {
      return this._ApiService.getReq('bootQuestions');
    }
  
    getAnswers(question_id:number): Observable<IBootResponse> {
      return this._ApiService.postReq('bootAnswers', question_id);
    }
  
}
