import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IProfileResponse } from '../../interfaces/HttpResponse';
import { IUpdateProfile } from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getUserInfo(): Observable<IProfileResponse> {
    return this._ApiService.postReq('profile','');
  }

  updateProfile(profileInfo:IUpdateProfile): Observable<IProfileResponse> {
    return this._ApiService.postReq('completeOrUpdateProfile', profileInfo);
  }

  updateProfileImage(image:File): Observable<IProfileResponse>{
    return this._ApiService.postReq('updateProfileImage', image);
  }

}
