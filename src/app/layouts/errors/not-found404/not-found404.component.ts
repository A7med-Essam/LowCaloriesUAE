import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-not-found404',
  templateUrl: './not-found404.component.html',
  styleUrls: ['./not-found404.component.scss']
})
export class NotFound404Component implements OnInit {

  constructor(
    private _LocalService:LocalService
  ) { }

  pageNotFound:string = ''
  ngOnInit(): void {
    if (this._LocalService.getJsonValue("currentLang") == 'ar') {
      this.pageNotFound = "الصفحة التي تبحث عنها غير موجودة"
    } 
    else {
      this.pageNotFound = "Page not found"
    }
  }

}
