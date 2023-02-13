import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { SocialMediaService } from 'src/app/shared/services/socialMedia/social-media.service';

@Component({
  selector: 'app-email-us',
  templateUrl: './email-us.component.html',
  styleUrls: ['./email-us.component.scss']
})
export class EmailUsComponent implements OnInit {
  EmailForm: FormGroup = new FormGroup({});
  EmailMessageModal:boolean = false;
  emailMessage:string = '';
  constructor(
    private _SocialMediaService:SocialMediaService,
    private _ToastrService:ToastrService,
    private _FormBuilder:FormBuilder,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
    this.setEmailForm();
  }

  setEmailForm() {
    this.EmailForm = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      subject: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [Validators.required, Validators.pattern('^[\\d]{10}$')]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(data:FormGroup) {
    if (data.valid) {
      this._SocialMediaService.sendEmail(data.value).subscribe(
        res=>{
          this.emailMessage = res.message
          this.EmailMessageModal = true;
          this.EmailForm.reset();
        }
      );
    } 
    else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error('يرجى التحقق من النموذج الخاص بك', 'جميع الحقول مطلوبة', { timeOut: 3000 });
        this.emailMessage = 'يرجى التحقق من النموذج الخاص بك'
      }
      else{
        this._ToastrService.error('Please check your form', 'All fields are required', { timeOut: 3000 });
        this.emailMessage = 'All fields are required, please check your form'
      }
      this.EmailMessageModal = true;
    }
  }

}