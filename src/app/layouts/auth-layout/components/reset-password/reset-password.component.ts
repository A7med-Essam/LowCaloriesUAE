import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { IResetPassword } from 'src/app/shared/interfaces/Auth';
import { IDefaultResponse } from 'src/app/shared/interfaces/HttpResponse';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup = new FormGroup({});
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService:AuthService,
    private _ActivatedRoute:ActivatedRoute,
    private _Router:Router,
  ) { }

  ngOnInit(): void {
    this.setResetForm();
  }

  setResetForm() {
    this.resetForm = this._FormBuilder.group({
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null, [Validators.required]),
    });
  }

  msg:Message[] = [
    {
      severity:'',
      summary:'',
      detail:''
    },
  ];
  isSubmit:boolean = false;

  onSubmit(data:FormGroup) {
    if (data.valid) {
      const allParams = this._ActivatedRoute.snapshot.queryParams;
      let newPassword:IResetPassword = {
        password: data.value.password,
        password_confirmation: data.value.password_confirmation,
        token: allParams.token,
        email: allParams.email
      }
      this._AuthService.resetPassword(newPassword).subscribe(
        (res:IDefaultResponse) => {
          if (res.status == 1) {
            this._Router.navigate(['/auth/login']);
            this.msg = [
              {severity:'success', summary:'success', detail:res.message},
            ];
          }
          else{
            this.msg = [
              {severity:'error', summary:'error', detail:res.message},
            ];
          }
          this.isSubmit = true;
          setTimeout(() => {
            this.isSubmit = false;
          }, 8000);
        }
      )
    } 
  }

}
