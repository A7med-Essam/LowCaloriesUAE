import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { IClinic } from 'src/app/shared/interfaces/clinic';
import { IAreasResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IArea } from 'src/app/shared/interfaces/location';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})

export class Step1Component implements OnInit, AfterViewChecked {
  @Input() Clinic!: IClinic[];
  @Output() isValidForm: EventEmitter<boolean> = new EventEmitter(false);
  @Output() EmirateId: EventEmitter<number> = new EventEmitter();
  @Output() ClinicForm: EventEmitter<FormGroup> = new EventEmitter();
  clinicFormData: FormGroup = new FormGroup({});
  @Input() ClinicForm2!:FormGroup;

  constructor(
    private _FormBuilder:FormBuilder,
    private _SharedService:SharedService,
    private _LocationService:LocationService,
    private translate:TranslateService,
    private _AuthService:AuthService
  ) { }

  ngAfterViewChecked(): void {
    if (this.Clinic.length > 0) {
      if (this.translate.currentLang == 'ar') {
        this.Clinic.map( c => {
          c.name = c.name_ar
        })
      }
    }
  }

  ngOnInit(): void {
    this.setClinicForm();
    this.ValidateForm();
    this.getUserInfo();
  }

  getUserInfo(){
    this._AuthService.currentUser.subscribe((res:IUser) => {
      if (res) {
        this.clinicFormData.controls['name'].setValue(res.name);
        this.clinicFormData.controls['email'].setValue(res.email);
        this.clinicFormData.controls['mobile'].setValue(res.mobile);
      }
    })
  }

  setClinicForm() {
    this.clinicFormData = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, [Validators.required, Validators.pattern('^[\\d]{10}$')]),
      emirate: new FormControl(null, [Validators.required]),
      area: new FormControl(null, [Validators.required]),
      whatsApp: new FormControl(null),
    });
  }

  ValidateForm(){
    this.clinicFormData.valueChanges.subscribe({
      next: data => {
        if (this.clinicFormData.valid) {
          let SelectedEmirate = this.clinicFormData.get("emirate")?.value;
          this.isValidForm.emit(true);
          this.EmirateId.emit(SelectedEmirate);
          this.ClinicForm.emit(this.clinicFormData)
        }
        else{
          this.isValidForm.emit(false);
        }
      },
    });
    this.setForm();
  }

  setForm(){
    if (this.ClinicForm2) {
      this.clinicFormData.controls['name'].setValue(this.ClinicForm2.value.name);
      this.clinicFormData.controls['email'].setValue(this.ClinicForm2.value.email);
      this.clinicFormData.controls['mobile'].setValue(this.ClinicForm2.value.mobile);
      this.clinicFormData.controls['emirate'].setValue(this.ClinicForm2.value.emirate);
      this.clinicFormData.controls['whatsApp'].setValue(this.ClinicForm2.value.whatsApp);
      this.clinicFormData.controls['area'].setValue(this.ClinicForm2.value.area);
    }
    if (this.ClinicForm2?.value?.emirate) {
      this.getAreas(this.ClinicForm2.value.emirate)
    }
  }

  Areas: IArea[] = [];

  getAreas(emirate_id:number){
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: emirate_id,
    }) as any as number;
    this._LocationService.getAreas(id).subscribe( (res:IAreasResponse)=>{
      res.data.forEach((Area:IArea) => this.Areas.push(Area));
      if (this.translate.currentLang == 'ar') {
        this.Areas.map( a => {
          a.area_en = a.area_ar
        })
      }
      if (emirate_id) {
        this.clinicFormData.controls['area'].setValue(this.ClinicForm2?.value.area);
      }
    })
  }
}
