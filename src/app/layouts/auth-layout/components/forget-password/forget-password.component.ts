import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { IDefaultResponse } from 'src/app/shared/interfaces/HttpResponse';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotForm: FormGroup = new FormGroup({});
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService:AuthService
  ) { }

  ngOnInit(): void {
    this.setForgotForm();
  }

  setForgotForm() {
    this.forgotForm = this._FormBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
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
  onSubmit(data:FormGroup, submitBtn:HTMLButtonElement) {
    if (data.valid) {
      this._AuthService.sendResetMail(data.value.email).subscribe(
        (res:IDefaultResponse) => {
          if (res.status == 1) {
            this.msg = [
              {severity:'success', summary:'success', detail:res.message},
            ];
            this.isSubmit = true;
            let counter = 60;
            submitBtn.disabled = true;
            setInterval(() => {
              if (counter > 0) {
                counter --;
                submitBtn.textContent = `Wait ${counter}s for resend mail again`;
              } else {
                clearInterval()
              }
            },1000)
      
            setTimeout(() => {
              submitBtn.textContent = `Send password reset link`;
              submitBtn.disabled = false;
            },counter*1000)
          }
          else{
            this.msg = [
              {severity:'warn', summary:'warning', detail:res.message},
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
