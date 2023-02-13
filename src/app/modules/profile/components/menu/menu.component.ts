import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { IMenuResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IMenu } from 'src/app/shared/interfaces/menu';
import { Plan_Categories_CustomOptions } from 'src/app/shared/models/ngx-owlcarousel';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  Categories_customOptions:OwlOptions = Plan_Categories_CustomOptions;
  ProgramMeals:IMenu[] = [];
  category_index:number = 0;

  constructor(
    private _SharedService:SharedService,
    private _MenuService:MenuService,
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.getMeals();
    if (this.translate.currentLang == "ar") {
      Plan_Categories_CustomOptions.rtl = true
    }
    else{
      Plan_Categories_CustomOptions.rtl = false
    }
  }

  toggleCategories(e:Event, index:number){
    this.category_index = index;
    this._SharedService.toggleCategories(e);
  }

  getMeals(){
    this._MenuService.getMenu().subscribe( (res:IMenuResponse) =>{
      this.ProgramMeals = [...res.data];
      if (this.translate.currentLang == "ar") {
        this.ProgramMeals.map(p =>{
          p.name = p.name_ar
          p.meal_details.map(m => {
            m.item = m.item_ar
            m.description = m.description_ar
          })
        })
      }
    })
  }

}
