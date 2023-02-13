import { Component, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { IResetPassword_profile } from 'src/app/shared/interfaces/Auth';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  CurrentPassword!: string;
  NewPassword!: string;
  ConfirmNewPassword!: string;
  constructor(
    private _AuthService:AuthService,
    private config: PrimeNGConfig,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    if (this.translate.currentLang == 'ar') {
      this.config.setTranslation({
        weak: 'ضعيف',
        medium: 'متوسط',
        strong: 'قوي',
        passwordPrompt:"أختار كلمه سر"
      });
    }
    else{
      this.config.setTranslation({
        weak: 'Week',
        medium: 'Medium',
        strong: 'Strong',
        passwordPrompt:"Choose password"
      });
    }
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  resetPassword() {
    let password:IResetPassword_profile = {
      old_password: this.CurrentPassword,
      password: this.NewPassword,
      password_confirmation: this.ConfirmNewPassword
    }
    this._AuthService.resetPassword_profile(password).subscribe();
  }
}
