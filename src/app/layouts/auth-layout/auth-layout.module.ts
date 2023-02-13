import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {DropdownModule} from 'primeng/dropdown';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import {MessagesModule} from 'primeng/messages';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { LangComponent } from './components/lang/lang.component';
@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    LangComponent
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DropdownModule,
    I18nModule,
    FormsModule,
    MessagesModule
  ]
})
export class AuthLayoutModule {
  constructor(
    private _I18nService:I18nService,
    public translate: TranslateService
  ) { 
    this._I18nService.saveCurrentLang(this.translate)
  }

}
