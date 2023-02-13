
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { plansCustomOptions } from 'src/app/shared/models/ngx-owlcarousel';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { PlansService } from 'src/app/shared/services/plans/plans.service';
import { IPrograms } from 'src/app/shared/interfaces/plans';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { IProgramsResponse } from 'src/app/shared/interfaces/HttpResponse';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, OnDestroy {
  customOptions:OwlOptions = plansCustomOptions;
  Programs:IPrograms[] = [];
  toggleCarousel:boolean = true;
  private readonly viewportChange = this.viewportRuler.change(200).subscribe(() => this.ngZone.run(() => this.setSize()));

  constructor(
    private _PlansService:PlansService,
    private _SharedService:SharedService,
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService:I18nService,
    public translate: TranslateService
    ) {
      this._I18nService.saveCurrentLang(this.translate)
      if (this._I18nService.currentLang == 'ar') {
        plansCustomOptions.rtl = true;
      }else{
        plansCustomOptions.rtl = false;
      }
    }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe( params =>{
      let layer_id:number = Number(params.get('layer_id'));
      this.getPrograms(layer_id);
    })

    if (window.innerWidth < 800) {
      this.toggleCarousel = false; 
    }
  }

  getPrograms(layer_id:number){
    let id:number = this._SharedService.getFormData({"layer_id":layer_id}) as any as number
    this._PlansService.getPrograms(id).subscribe( (res:IProgramsResponse) =>{
      this.Programs = [...res.data]
      if (this.translate.currentLang == 'ar') {
        this.Programs.map(p =>{
          p.name = p.name_ar
          p.description = p.description_ar
        })
      }
    })
  }

  ngOnDestroy() {
    this.viewportChange.unsubscribe();
  }

  setSize() {
    const { width, height } = this.viewportRuler.getViewportSize();
    if (width < 800) {
      this.toggleCarousel = false; 
    }
    else{
      this.toggleCarousel = true;
    }
  }

}
