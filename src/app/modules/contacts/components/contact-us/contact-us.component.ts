import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private _SharedService:SharedService,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
  }

  hover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

  unhover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }
}
