import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { IDefaultResponse, ISocialMediaResponse } from '../../interfaces/HttpResponse';
import { IEmailForm } from '../../interfaces/socialMedia';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  constructor(
    private _ApiService:ApiService
  ) { }

  getSocialMedia(): Observable<ISocialMediaResponse> {
    return this._ApiService.postReq('social_media','');
  }

  sendEmail(EmailForm:IEmailForm): Observable<IDefaultResponse> {
    return this._ApiService.postReq('contact_with_email', EmailForm);
  }
}
