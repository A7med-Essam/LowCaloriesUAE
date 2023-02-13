import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { ITranslateLang } from 'src/app/shared/interfaces/Auth';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent implements OnInit {


  lang:ITranslateLang[] = [
    {code:'en',name:'English'},
    {code:'ar',name:'العربية'}
  ];
  currentLang:string = this._LocalService.getJsonValue('currentLang') || 'en';

  constructor(
    private _LocalService:LocalService,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
  }

  changeLang(lang:string){
    this._I18nService.changeCurrentLang(this.translate, lang);
  }
}
