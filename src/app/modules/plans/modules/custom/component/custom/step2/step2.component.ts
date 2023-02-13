import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ICustom_detail, ICustomProgramsDetails, ISubscriptionData } from 'src/app/shared/interfaces/customPlan';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  @ViewChild('WarningModal') WarningModal!:ElementRef;
  @ViewChild('WarningModalMessage') WarningModalMessage!:ElementRef;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  @Input() Programs!:ICustomProgramsDetails;
  @Output() isValidForm: EventEmitter<boolean> = new EventEmitter(false);
  max_days!:ICustom_detail;
  min_days!:ICustom_detail;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  Days:{value:number}[] = [];
  uaeDate!:Date;
  disabledDays:number[] = [];
  @Output() SubscribtionDetailsData: EventEmitter<ISubscriptionData> =   new EventEmitter();
  Number_of_Days:number = 0; 
  deliveryNames:any[] = [];

  constructor(
    private _SharedService:SharedService,
    private _FormBuilder: FormBuilder,
    private elem: ElementRef,
    private _ToastrService:ToastrService,
    private _ElementRef:ElementRef,
    public translate: TranslateService
  ) {  }

  ngOnInit(): void {
    this.getMax_MinDetails(this.Programs.custom_detail);
    this.get_Number_of_Days();
    this.getProgramDetailsForm();
    this.ValidateForm();
    this.getUaeDate();
    this.getDisableDays();
    for (let i = 0; i < this.Programs.delivery_days.length; i++) {
      this.deliveryNames.push({en:this.Programs.delivery_days[i].day_name,ar:this.Programs.delivery_days[i].day_name_ar});
    }
  }
  
  getDisableDays(){
    for (let i = 0; i < this.Programs?.delivery_days?.length; i++) {
      if (this.Programs?.delivery_days[i]?.closed == 1) {
        this.disabledDays?.push(this._SharedService.getDayNumber(this.Programs?.delivery_days[i]?.day_name))
      }
    }
  }

  getUaeDate(){
    this.uaeDate = this._SharedService.getUaeTime();
  }

  get_Number_of_Days(){
    for (let i = Number(this.min_days.value); i <= Number(this.max_days.value); i++) {
      let obj:{value:number} = {value:i};
      // obj["value"] = i;
      this.Days.push(obj);
    }
  }

  getProgramDetailsForm(){
    this.Number_of_Days = this.Days[0]?.value;
    this.ProgramDetailsForm = this._FormBuilder.group({
      Number_of_Days : new FormControl(this.Days[0]?.value, [Validators.required]),
      Start_Date : new FormControl(null, [Validators.required]),
      CheckDays: new FormControl(false)
    })
    this.setDefaultDate()
  }

  ValidateForm(){
    this.ProgramDetailsForm.valueChanges.subscribe({
      next: data => {
        if (this.ProgramDetailsForm.valid) {
          setTimeout(() => {
            this.SubscribtionDetailsData.emit(this.getSubscriptionData(this.ProgramDetailsForm))
          },1);
          this.isValidForm.emit(true);
        }
      },
    });
  }

  getMax_MinDetails(array:ICustom_detail[]){
    array.forEach((e:ICustom_detail) => {
      switch (e.property) {
        case "max_days":
          this.max_days = e;
          break;
        case "min_days":
          this.min_days = e;
          break;
      }
    });
  }

  getSubscriptionData(data: FormGroup) {
    let SelectedDate: Date = data.value.Start_Date;
    let SubscriptionData:ISubscriptionData = {
      sub_days: data.value.Number_of_Days,
      start_date: SelectedDate.toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ),
      delivery_days: this.getDeliveryDays(),
    };
    return SubscriptionData;
  }

  getDeliveryDays(){
    const DeliveredDays = this.deliveredDays.nativeElement.children;
    let DaysCount: string[] = [];
    for (let i = 0; i < DeliveredDays.length; i++) {
      if (DeliveredDays[i].children[0].classList.contains('active')) {
        DaysCount.push(DeliveredDays[i].children[0].getAttribute("dayName"));
      }
    }
    let FilterDaysCount = DaysCount.filter( e => e !== null);
    return FilterDaysCount
  }

  is7Week:boolean = false;
  // CurrentSelectedDate = null
  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  onChange(e:HTMLSelectElement){
    this.Number_of_Days = Number(e.value)
    if (Number(e.value) >= 7) {
      this.is7Week = true; 
    }
    else{
      const DeliveredDays: HTMLElement[] = this.deliveredDays.nativeElement.children;
      for (let i = 0; i < DeliveredDays.length; i++) {
        if (DeliveredDays[i].children[0].classList.contains('active') && !DeliveredDays[i].children[0].classList.contains('zindex_minus')) {
            DeliveredDays[i].children[0].classList.remove("active")
        }
      }
      this.is7Week = false;
    }
  }

  setDefaultDate(){
    setTimeout(() => {
      let DefaultDate:Date = this.uaeDate;
      if (this.disabledDays.includes(this.uaeDate.getDay())) {
        DefaultDate.setDate(DefaultDate.getDate() + 1);
      }
      let firstDate = DefaultDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      this.ProgramDetailsForm.get('Start_Date')?.setValue(new Date(firstDate));
      const DeliveredDays = this._ElementRef.nativeElement.querySelectorAll('.deliveredDays');
      this._SharedService.onSelectedDate(new Date(firstDate), DeliveredDays[0]);
    }, 1);
  }

  displayDeliveryMsg:boolean = false;
  DeliveryMsg:string = '';

  checkDeliveryDays(e: HTMLElement){
    this._SharedService.checkDays(e, this.AllWeek, this.ProgramDetailsForm);
    if (this.Number_of_Days >= 7) {
      this.getAllWeekChecked();
    }
    this.checkDeliveryMsg(e);
    this.Validate_DeliveryDays_BasedOn_NumberOfDays(e);
  }

  getAllWeekChecked(){
    let days = this._ElementRef.nativeElement.querySelectorAll('.deliveredDays .dayWeek.active');
    if (days.length == 7) {
      this.AllWeek.nativeElement.classList.add('active');
    }
    else{
      this.AllWeek.nativeElement.classList.remove('active');
    }
  }

  checkDeliveryMsg(CheckedDay:HTMLElement){
    let elements = this.elem?.nativeElement?.querySelectorAll('.deliveredDays .active');
    if (this.Number_of_Days == 5 && elements.length <=5) {
      this.getDeliveryMsg(CheckedDay);
    }
    else if(this.Number_of_Days == 6 && elements.length <=6){
      this.getDeliveryMsg(CheckedDay);
    }
    else if(this.Number_of_Days >= 7){
      this.getDeliveryMsg(CheckedDay);
    }
  }

  getDeliveryMsg(CheckedDay:HTMLElement){
    if (CheckedDay.classList.contains("active")) {
      this.disabledDays.forEach((day:number) => {
        if (day == Number(CheckedDay.getAttribute("day"))) {
          this.setDeliveryMsg(Number(CheckedDay.getAttribute("day")));
          this.displayDeliveryMsg = true;
        }
      });
    }
  }

  setDeliveryMsg(day:number){
    if (day == 0) {
      if (this.translate.currentLang == 'ar') {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayNameAr("6"),
          before: this._SharedService.getDayNameAr(day.toString()),
          after: this._SharedService.getDayNameAr((day+1).toString())
        })
      } 
      else {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayName('6'),
          before: this._SharedService.getDayName(day.toString()),
          after: this._SharedService.getDayName((day+1).toString())
        })
      }
    }
    else if (day == 6)
    {
      if (this.translate.currentLang == 'ar') {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayNameAr((day-1).toString()),
          before: this._SharedService.getDayNameAr(day.toString()),
          after: this._SharedService.getDayNameAr('0')
        })
      } 
      else {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayName((day-1).toString()),
          before: this._SharedService.getDayName(day.toString()),
          after: this._SharedService.getDayName('0')
        })
      }
    }

    else{
      if (this.translate.currentLang == 'ar') {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayNameAr((day-1).toString()),
          before: this._SharedService.getDayNameAr(day.toString()),
          after: this._SharedService.getDayNameAr((day+1).toString())
        })
      } 
      else {
        this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
        { 
          current: this._SharedService.getDayName((day-1).toString()),
          before: this._SharedService.getDayName(day.toString()),
          after: this._SharedService.getDayName((day+1).toString())
        })
      }
    }
  }

  checkAllWeekBtn(e: HTMLElement){
      this.getDeliveryMsg_AllWeek(e);
      this._SharedService.checkAllWeek(e);
  }

  getDeliveryMsg_AllWeek(e:HTMLElement){
    for (let i = 0; i < this.deliveredDays.nativeElement.children.length; i++) {
        let day:HTMLElement = this.deliveredDays.nativeElement.children[i].children[0];
        for (let j = 0; j < this.disabledDays.length; j++) {
          if (this.disabledDays[j] == Number(day.getAttribute('day')) && !day.classList.contains('active')) {
            this.setDeliveryMsg_AllWeek();
          }
        }
    }
  }

  setDeliveryMsg_AllWeek(){
    this.displayDeliveryMsg = true;
    for (let i = 0; i < this.disabledDays.length; i++) {
        if (this.translate.currentLang == "ar") {
          this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
            { 
              current: this._SharedService.getDayNameAr((Number(this.disabledDays[i])-1).toString()),
              before: this._SharedService.getDayNameAr(this.disabledDays[i].toString()),
              after: this._SharedService.getDayNameAr((Number(this.disabledDays[i]+1)).toString())
            }
          );
        }
        else{
          this.DeliveryMsg = this.translate.instant('modals.delivery.msg', 
            { 
              current: this._SharedService.getDayName((Number(this.disabledDays[i])-1).toString()),
              before: this._SharedService.getDayName(this.disabledDays[i].toString()),
              after: this._SharedService.getDayName((Number(this.disabledDays[i]+1)).toString())
            }
          );
        }
    }
  }

  getDayNumber(Day_name: string| undefined| null){
    return this._SharedService.getDayNumber(Day_name);
  }

  Validate_DeliveryDays_BasedOn_NumberOfDays(e: HTMLElement){
    let elements = this.elem?.nativeElement?.querySelectorAll('.deliveredDays .active');
    if (this.Number_of_Days == 5 && elements.length > 5) {
      e?.classList?.remove("active")
      elements = this.elem?.nativeElement?.querySelectorAll('.deliveredDays .active');
      if (elements.length == 5) {

          if (this.translate.currentLang == "ar") {
            this._ToastrService.warning('يمكنك تحديد 5 أيام فقط', '', { timeOut: 4000 });
          }
          else{
            this._ToastrService.warning('You can select only 5 days', '', { timeOut: 4000 });
          }
      }
    }
    else if (this.Number_of_Days == 6 && elements.length > 6) {
      e?.classList?.remove("active")
      elements = this.elem?.nativeElement?.querySelectorAll('.deliveredDays .active');
      if (elements.length == 6) {
          if (this.translate.currentLang == "ar") {
            this._ToastrService.warning('يمكنك تحديد 6 أيام فقط', '', { timeOut: 4000 });
          }
          else{
            this._ToastrService.warning('You can select only 6 days', '', { timeOut: 4000 });
          }
      }
    }
  }

}
