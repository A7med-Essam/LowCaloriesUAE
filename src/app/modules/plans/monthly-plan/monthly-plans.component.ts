import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { ILayers } from 'src/app/shared/interfaces/plans';
import { PlansService } from 'src/app/shared/services/plans/plans.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-monthly-plans',
  templateUrl: './monthly-plans.component.html',
  styleUrls: ['./monthly-plans.component.scss']
})
export class MonthlyPlansComponent implements OnInit {
  Layers:ILayers[] = [];
  LayerName:any[] = [];
  constructor(
    private _SharedService:SharedService,
    private _PlansService:PlansService,
    private _I18nService:I18nService,
    public translate: TranslateService
    ) {
      this._I18nService.saveCurrentLang(this.translate)
    }

  ngOnInit(): void {
    this.getLayers();
  }

  hover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

  unhover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

  getLayers(){
    this._PlansService.getLayers().subscribe(res=>{
      this.Layers = [...res.data];
      this.Layers.forEach(element => {
        this.LayerName.push({en:element.name, ar:element.name_ar})
      });
    })
  }
  
}
