import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ITermsResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})

export class TermsService {
  constructor(
    private _ApiService:ApiService
  ) { }

  getTerms(): Observable<ITermsResponse> {
    return this._ApiService.postReq('terms','');
  }

}
