import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { menu, normalPlan_Categories_CustomOptions } from 'src/app/shared/models/ngx-owlcarousel';
import { NormalPlanService } from 'src/app/shared/services/plans/normal-plan.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { INormalProgramDetails, IProgramMeals } from 'src/app/shared/interfaces/normalPlan';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  category_index:number = 0;
  customOptions:OwlOptions = normalPlan_Categories_CustomOptions;
  menuCustomOptions:OwlOptions = menu;
  ProgramMeals:IProgramMeals[] = [];
  ProgramDetails!:INormalProgramDetails;


  constructor(
    private _SharedService:SharedService,
    private _NormalPlanService:NormalPlanService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) { 
    this._I18nService.saveCurrentLang(this.translate)
    if (this._I18nService.currentLang == "ar") {
      normalPlan_Categories_CustomOptions.rtl = true;
      menu.rtl = true;
    }
  }

  ngOnInit(): void {
    this.getProgramDetails();
    this.getMeals();
  }

  toggleCategories(e:Event, index:number){
    this.category_index = index;
    this._SharedService.toggleCategories(e);
  }

  getMeals(){
    // this._NormalPlanService.getCurrentMeals();
    this._NormalPlanService.CurrentMeals.subscribe( (res:IProgramMeals[]) => {
      if (res) {
        this.ProgramMeals = res 
        for (let i = 0; i < this.ProgramMeals.length; i++) {
          this.ProgramMeals[i].meals = [...new Map(this.ProgramMeals[i].meals.map((item, key) => [item.id, item])).values()]
        }
        this.translate.currentLang == 'ar'? this.ProgramMeals.map( p => {
          p.category_name = p.category_name_ar
          p.meals.map( m => {
            m.description = m.description_ar
            m.meal_name_en = m.meal_name_ar
          })
        }): false
      }
      else{
        this._Router.navigate(['../step1'], {
          relativeTo: this._ActivatedRoute,
        });
      }
    })
  }

  getProgramDetails(){
    this._NormalPlanService.ProgramDetails.subscribe(res=>{
      this.ProgramDetails = res;
    })
  }

}