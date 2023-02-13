import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ILayersResponse, IProfilePlansResponse, IProgramsResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  constructor(
    private _ApiService:ApiService,
  ) { }

  getLayers(): Observable<ILayersResponse> {
    return this._ApiService.getReq('layers');
  }

  getPrograms(layer_id:number): Observable<IProgramsResponse> {
    return this._ApiService.postReq('programs',layer_id);
  }

  getMyPlans(): Observable<IProfilePlansResponse>{
    return this._ApiService.postReq('myPlans','');
  }
}
