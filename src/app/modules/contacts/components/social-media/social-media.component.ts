import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { ISocialMediaResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ISocialMedia } from 'src/app/shared/interfaces/socialMedia';
import { SocialMediaService } from 'src/app/shared/services/socialMedia/social-media.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  SocialMediaAccounts:ISocialMedia[] = [];
  constructor(
    private _SocialMediaService:SocialMediaService,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
    this.getSocialMedia()
  }

  getSocialMedia(){
    this._SocialMediaService.getSocialMedia().subscribe((res:ISocialMediaResponse)=>{
      this.SocialMediaAccounts = [...res.data]
    })
  }

}
