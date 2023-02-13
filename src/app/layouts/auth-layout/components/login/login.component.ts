import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  faEnvelope,
  faEye,
  faLock,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/shared/services/local.service';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { IAuthResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ITranslateLang } from 'src/app/shared/interfaces/Auth';
import { TermsService } from 'src/app/shared/services/terms/terms.service';
import { ITerms } from 'src/app/shared/interfaces/terms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  faEnvelope = faEnvelope;
  faEye = faEye;
  faLock = faLock;
  loginForm: FormGroup = new FormGroup({});
  lang: ITranslateLang[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];
  currentLang: any = this._LocalService.getJsonValue('currentLang') || 'en';
  togglePassword(PasswordInput: HTMLInputElement) {
    if (this.faEye == faEye) {
      this.faEye = faEyeSlash;
      PasswordInput.type = 'text';
    } else {
      this.faEye = faEye;
      PasswordInput.type = 'password';
    }
  }

  constructor(
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _LocalService: LocalService,
    private _I18nService: I18nService,
    private _TermsService: TermsService,
    public translate: TranslateService
  ) {
    if (this._LocalService.getJsonValue('userInfo') != null) {
      this._Router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.setLoginForm();
    if (this.currentLang == 'ar') {
      this.currentLang = this.lang[1];
    } else {
      this.currentLang = this.lang[0];
    }
  }

  setLoginForm() {
    this.loginForm = this._FormBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      this._AuthService.signIn(data.value).subscribe((res: IAuthResponse) => {
        if (res.status == 1) {
          this._AuthService.saveUser(res.data);
          this._Router.navigate(['/home']);
        }
      });
    } else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error(
          'فشلت محاولة تسجيل الدخول',
          'خطأ رئيسي في المصادقة',
          { timeOut: 3000 }
        );
      } else {
        this._ToastrService.error(
          'Login attempt failed',
          'Authentication Major Error',
          { timeOut: 3000 }
        );
      }
    }
  }

  changeLang(lang: string) {
    this._I18nService.changeCurrentLang(this.translate, lang);
  }

  terms: ITerms[] = [];
  getTerms() {
    this._TermsService.getTerms().subscribe((res) => {
      this.terms = res.data;
      if (this.translate.currentLang == 'ar') {
        for (let i = 0; i < this.terms.length; i++) {
          this.terms[i].description = this.terms[i].description_ar;
          this.terms[i].header = this.terms[i].header_ar;
        }
      }
    });
  }
}
