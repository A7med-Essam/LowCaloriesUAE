import { Component, OnInit } from '@angular/core';
import { ProfileInfoService } from 'src/app/shared/services/profile/profile-info.service';
import { faListCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faCalendar, faPhone, faWeight, faVenusMars, faUser,faEnvelope, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { IProfileResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IUserProfile } from 'src/app/shared/interfaces/profile';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  genderType: string[] = ['male', 'female'];
  user!:IUserProfile
  faUser = faUser;
  faEnvelope = faEnvelope;
  faClipboard = faListCheck;
  faEdit = faEdit;
  faCalendar = faCalendar;
  faPhone = faPhone;
  faWeight = faWeight;
  faVenusMars = faVenusMars;
  faBack = faArrowUpFromBracket;
  isCompleted:boolean = false;
  isEditable:boolean = false;
  CompleteProfileForm: FormGroup = new FormGroup({});
  EditProfileForm: FormGroup = new FormGroup({});
  isLoaded:boolean = true;

  constructor(
    private _FormBuilder: FormBuilder,
    private _ProfileInfoService:ProfileInfoService,
    private _AuthService:AuthService,
    public translate: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.getUserInfo();
    this.setCompleteProfileForm();
  }

  getUserInfo(){
    this._ProfileInfoService.getUserInfo().subscribe(
      (res:IProfileResponse)=>{
        this.user = res.data;
        if (this.translate.currentLang == 'ar') {
          this.user.addresses.map( u => {
            u.area.area_en = u.area.area_ar
            u.area.emirate.name = u.area.emirate.name_ar
          })
        }
        this.isLoaded = false;
      }
    );
  }

  setCompleteProfileForm(){
    this.CompleteProfileForm = this._FormBuilder.group({
      date_of_birth : new FormControl(null, [Validators.required]),
      height : new FormControl(null, [Validators.required]),
      weight : new FormControl(null, [Validators.required]),
      second_mobile : new FormControl(null, [Validators.required]),
      gender : new FormControl(null, [Validators.required]),
    })
  }

  setEditProfileForm(){
    this.EditProfileForm = this._FormBuilder.group({
      date_of_birth : new FormControl(new Date(this.user.profile.date_of_birth), [Validators.required]),
      height : new FormControl(this.user.profile.height, [Validators.required]),
      weight : new FormControl(this.user.profile.weight, [Validators.required]),
      second_mobile : new FormControl(this.user.profile.second_mobile, [Validators.required]),
      gender : new FormControl(this.user.profile.gender, [Validators.required]),
      name : new FormControl(this.user.name, [Validators.required]),
      email : new FormControl(this.user.email, [Validators.required,Validators.email]),
      mobile : new FormControl(this.user.mobile, [Validators.required]),
    })
  }

  onSubmit(data:FormGroup){
    this.CompleteProfileForm.controls['date_of_birth'].setValue(new Date(data.get('date_of_birth')?.value).toLocaleDateString('en-CA'));
    if (data.valid) {
      this._ProfileInfoService.updateProfile(data.value).subscribe((res:IProfileResponse)=>{
        this.getUserInfo();
        this.isCompleted = false;
      })
    } 
  }

  onSubmitEdit(data:FormGroup){
    this.EditProfileForm.controls['date_of_birth'].setValue(new Date(data.get('date_of_birth')?.value).toLocaleDateString('en-CA'));
    if (data.valid) {
      this._ProfileInfoService.updateProfile(data.value).subscribe((res:IProfileResponse)=>{
        if (res.status == 1) {
          let userData:IUser = {
            mobile:res.data.mobile,
            name:res.data.name,
            token:res.data.token,
            email:res.data.email,
            id:res.data.id,
            image:res.data.image
          }
          this._AuthService.saveUser(userData);
          this.getUserInfo();
          this.isEditable = false;
        }
      })
    } 
  }

}
