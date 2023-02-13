import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalService } from 'src/app/shared/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  textDir: string = 'ltr';
  currentLang!: string;

  constructor(
    private _LocalService:LocalService
  ) {}

  saveCurrentLang(translate: TranslateService) {
    this.currentLang = this._LocalService.getJsonValue('currentLang') || 'en';
    translate.use(this.currentLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      if(event.lang == 'ar')
      {
        this.textDir = 'rtl';
        document.documentElement.setAttribute('lang', 'ar');
      } 
      else
      {
        this.textDir = 'ltr';
        document.documentElement.setAttribute('lang', 'en');
      }
      document.body.dir = this.textDir;
    });
  }

  changeCurrentLang(translate:TranslateService ,lang: string) {
    translate.use(lang);
    this._LocalService.setJsonValue('currentLang', lang);
  }
}
