import { Component, OnInit } from '@angular/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inner-layout',
  templateUrl: './inner-layout.component.html',
  styleUrls: ['./inner-layout.component.scss']
})
export class InnerLayoutComponent implements OnInit {

  constructor(
    private _I18nService:I18nService,
    public translate: TranslateService
  ) { 
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
  }

}
