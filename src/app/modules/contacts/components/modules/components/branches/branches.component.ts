import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IBranchResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IBranch } from 'src/app/shared/interfaces/location';
import { BranchesService } from 'src/app/shared/services/branches/branches.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  Emirates:IBranch[] = [];
  constructor(
    private _BranchesService:BranchesService,
    private _SharedService:SharedService,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
    this.getEmirates()
  }

  getEmirates(){
    this._BranchesService.getEmirates().subscribe((res:IBranchResponse)=>{
      this.Emirates = [...res.data]
      if (this.translate.currentLang == 'ar') {
        this.Emirates.map( e =>{
          e.name = e.name_ar
          e.name_ar = e.name
        })
      }
    })
  }

  hover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

  unhover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

}
