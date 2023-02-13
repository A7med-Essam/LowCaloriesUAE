import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IBranchDetailsResponse, IBranchResponse } from '../../interfaces/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getEmirates(): Observable<IBranchResponse> {
    return this._ApiService.postReq('emirates_branches','');
  }

  getBranches(emirate_id:number): Observable<IBranchDetailsResponse> {
    return this._ApiService.postReq('branches',emirate_id);
  }
}
