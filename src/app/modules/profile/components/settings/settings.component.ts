import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { ITranslateLang } from 'src/app/shared/interfaces/Auth';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Output() Notifications: EventEmitter<number> = new EventEmitter();
  @Output() Terms: EventEmitter<number> = new EventEmitter();
  @Output() Branches: EventEmitter<number> = new EventEmitter();
  @Output() Menu: EventEmitter<number> = new EventEmitter();
  lang:ITranslateLang[] = [
    {code:'en',name:'English'},
    {code:'ar',name:'العربية'}
  ];
  constructor(
    private _LocalService:LocalService,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) {}

  currentLang:string = this._LocalService.getJsonValue('currentLang') || 'en';

  ngOnInit(): void {
  }

  hover(element:HTMLElement, src:string) {
    element.setAttribute('src', src);
  }

  unhover(element:HTMLElement, src:string) {
    element.setAttribute('src', src);
  }
  
  getTerms(){
    this.Terms.emit(10)
  }

  getNotifications(){
    this.Notifications.emit(11)
  }

  getBranches(){
    this.Branches.emit(12)
  }

  getMenu(){
    this.Menu.emit(5)
  }

  changeLang(lang:string){
    this._I18nService.changeCurrentLang(this.translate, lang);
    window.location.reload();
  }
}
