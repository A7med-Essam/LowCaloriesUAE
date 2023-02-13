import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalService } from 'src/app/shared/services/local.service';
import {IUser} from '../../../../shared/interfaces/Auth'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLogin:boolean = false;
  User!:IUser;  
  currentLang:string = this._LocalService.getJsonValue('currentLang') || 'en';
  availableLang:string = '';
    constructor(
    private _AuthService: AuthService,
    private _LocalService:LocalService,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) {
    if (this.currentLang == 'en') {
      this.availableLang = 'ar';
    } 
    else {
      this.availableLang = 'en';
    }
  }

  changeLang(lang:string){
      this._I18nService.changeCurrentLang(this.translate, lang);
      if (lang == 'en') {
        this.availableLang = 'ar';
      } else {
        this.availableLang = 'en';
      }
    window.location.reload();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  logOut(){
    this._AuthService.logOut()
  }

  getCurrentUser(){
    this._AuthService.currentUser.subscribe( (data:IUser|null) =>{
      if (data == null) {
        this.isLogin = false;
      }
      else{
        this.isLogin = true;
        this.User = data;
      }
    })
  }

}


