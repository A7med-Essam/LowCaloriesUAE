import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faLock, faEyeSlash, faUser, faCalendar, faPhone, faWeight, faVenusMars ,faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
// import { LocationService } from 'src/app/shared/services/location/location.service';
import { ConfirmedValidator } from './ConfirmedValidator';
// import { IArea,IEmirate,IAreasResponse, IEmirateResponse } from "../../../../shared/interfaces/location";
import { TranslateService } from '@ngx-translate/core';
import { IRegisterData } from 'src/app/shared/interfaces/Auth';
import { IAuthResponse } from 'src/app/shared/interfaces/HttpResponse';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  faEye1 = faEye;
  faEye2 = faEye;
  faEyeSlash = faEyeSlash;
  faLock = faLock;
  faUser = faUser;
  faEnvelope = faEnvelope;
  // faCalendar = faCalendar;
  faPhone = faPhone;
  // faWeight = faWeight;
  // faVenusMars = faVenusMars;
  // faLocation = faLocationDot;

  registerForm: FormGroup = new FormGroup({});
  // genderType: string[] = ['male', 'female'];
  // emirate: IEmirate[] = [];
  // Areas: IArea[] = [];

  // selectedCity: any;
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _ToastrService:ToastrService,
    private _Router:Router,
    // private _LocationService:LocationService,
    private _SharedService:SharedService,
    private translate:TranslateService
  ) { }

  
  togglePassword(PasswordInput:HTMLInputElement){
    if (PasswordInput.classList.contains('PasswordInput1')) {
      if (this.faEye1 == faEye) {
        this.faEye1 = faEyeSlash;
        PasswordInput.type = "text";
      } 
      else {
        this.faEye1 = faEye;
        PasswordInput.type = "password";
      }
    } 
    else {
      if (this.faEye2 == faEye) {
        this.faEye2 = faEyeSlash;
        PasswordInput.type = "text";
      } 
      else {
        this.faEye2 = faEye;
        PasswordInput.type = "password";
      }
    }
  }

  ngOnInit(): void {
    // this.getEmirates();
    this.setRegisterForm();
  }

  setRegisterForm(){
    this.registerForm = this._FormBuilder.group({
      'name' : new FormControl(null, [Validators.required]),
      'email' : new FormControl(null, [Validators.required,Validators.email]),
      'password':new FormControl(null , [Validators.pattern('^.{8,}$'), Validators.required]),
      // 'profile[date_of_birth]' : new FormControl(null, [Validators.required]),
      'mobile' : new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      // 'profile[height]' : new FormControl(null),
      // 'profile[weight]' : new FormControl(null),
      // 'profile[gender]' : new FormControl(null),
      // 'address[landline]' : new FormControl(null),
      // 'address[area_id]' : new FormControl(null),
      // 'address[address]' : new FormControl(null),
      // 'second_mobile' : new FormControl(null),
      // 'emirate_id' : new FormControl(null),
      'confirm_password':new FormControl(null)
    },{ 
      validator: ConfirmedValidator('password', 'confirm_password')
    } as AbstractControlOptions)
  }

  onSubmit(data:FormGroup){
    if (data.valid) {
      delete this.registerForm.value.confirm_password;
      // delete this.registerForm.value.emirate_id;
      let RegisterData:IRegisterData = this._SharedService.getFormData(data.value) as any as IRegisterData
      this._AuthService.signUp(RegisterData).subscribe( (res:IAuthResponse) => {
          if (res.status == 1) {
            // this._Router.navigate(['/auth/login']);
            this._AuthService.saveUser(res.data);
            this._Router.navigate(['/home']);
          } 
        });
    } 
    else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error('فشلت محاولة التسجيل', 'خطأ رئيسي في المصادقة', { timeOut: 3000 });
      }
      else{
        this._ToastrService.error('Registration attempt failed', 'Authentication Major Error', { timeOut: 3000 });
      }
    }
  }

  // getEmirates(){
  //   this.emirate = [];
  //   this._LocationService.getEmirates().subscribe( (res:IEmirateResponse)=>{
  //     res.data.forEach((Emirate:IEmirate) => this.emirate.push(Emirate));
  //   })
  // }

  // getAreas(emirate_id:number){
  //   this.Areas = [];
  //   let id: number = this._SharedService.getFormData({
  //     emirate_id: emirate_id,
  //   }) as any;
  //   this._LocationService.getAreas(id).subscribe( (res:IAreasResponse)=>{
  //     res.data.forEach((Area:IArea) => this.Areas.push(Area));
  //   })
  // }
}
// TODO: refactor this page