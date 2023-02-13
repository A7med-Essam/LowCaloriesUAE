import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { INormalProgramDetailsResponse, IProgramMealsResponse } from 'src/app/shared/interfaces/HttpResponse';
import { INormalProgramDetails, ISubscriptionData_NormalPlan } from 'src/app/shared/interfaces/normalPlan';
import { NormalPlanService } from 'src/app/shared/services/plans/normal-plan.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  @ViewChild('AllWeek') AllWeek!: ElementRef;
  @ViewChild('deliveredDays') deliveredDays!: ElementRef;
  @ViewChild('MealsType') MealsType!: ElementRef;
  @ViewChild('SnacksType') SnacksType!: ElementRef;

  ProgramDetails!: INormalProgramDetails;
  program_id: number = 0;
  uaeDate!: Date;
  ProgramDetailsForm: FormGroup = new FormGroup({});
  disabledDays:number[] = [];
  deliveryNames:any[] = [];
  FirstDay:Number = 0;
  displayDeliveryMsg:boolean = false;
  DeliveryMsg:string = '';

  constructor(
    private _ElementRef:ElementRef,
    private _NormalPlanService: NormalPlanService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private _ToastrService: ToastrService,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.program_id = Number(params.get('Program_id'));
      this.getNormalProgramDetails(this.program_id);
      this.getUaeDate();
      this.getProgramDetailsForm();
    });
  }

  getUaeDate() {
    this.uaeDate = this._SharedService.getUaeTime();
  }

  getNormalProgramDetails(ProgramId: number) {
    let id: number = this._SharedService.getFormData({program_id: ProgramId}) as any as number;
    this._NormalPlanService.getNormalProgramDetails(id).subscribe((res: INormalProgramDetailsResponse) => {
        this._NormalPlanService.ProgramDetails.next(res.data)
        this.ProgramDetails = res.data;
        if (this.translate.currentLang == 'ar') {
          this.ProgramDetails.meal_types.map(t => {
            t.meal_type_name = t.meal_type_name_ar
          })
          this.ProgramDetails.snack_types.map(t => {
            t.meal_type_name = t.meal_type_name_ar
          })
          this.ProgramDetails.name = this.ProgramDetails.name_ar
        }
        this.FirstDay = this.ProgramDetails.subscription_days[0].day_count;
        this.getProgramDetailsForm();
        for (let i = 0; i < this.ProgramDetails?.delivery_days?.length; i++) {
          this.deliveryNames.push({en:this.ProgramDetails.delivery_days[i].day_name,ar:this.ProgramDetails.delivery_days[i].day_name_ar});
          if (this.ProgramDetails?.delivery_days[i]?.closed == 1) {
            this.disabledDays.push(this._SharedService.getDayNumber(this.ProgramDetails?.delivery_days[i].day_name))
          }
        }
      });
  }

  getProgramDetailsForm() {
    this.ProgramDetailsForm = this._FormBuilder.group({
      Number_of_Days: new FormControl(this.FirstDay, [Validators.required]),
      Type_of_Meals: new FormControl(false, [Validators.requiredTrue]),
      Start_Date: new FormControl(null, [Validators.required]),
      Type_of_Snacks: new FormControl(false),
      CheckDays: new FormControl(false),
    });
    this.setDefaultDate();
  }

  setDefaultDate(){
    setTimeout(() => {
      let DefaultDate:Date = this.uaeDate;
      if (this.disabledDays.includes(this.uaeDate.getDay())) {
        DefaultDate.setDate(DefaultDate.getDate() + 1);
      }
      let firstDate = DefaultDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      this.ProgramDetailsForm.get('Start_Date')?.setValue(new Date(firstDate));
      const DeliveredDays: HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.deliveredDays');
      this._SharedService.onSelectedDate(new Date(firstDate), DeliveredDays[0]);
    }, 1);
  }

  checkTypeOfMeals(){
    let MealsCount: string[] = this.getSelectedMeals();
    if (MealsCount.length >= this.ProgramDetails.min_meals) {
      this.ProgramDetailsForm.get("Type_of_Meals")?.setValidators(Validators.required)
    }
    else{
      this.ProgramDetailsForm.get("Type_of_Meals")?.setValidators(Validators.requiredTrue)
    }
  } 

  onSubmit(data: FormGroup) {
    const subData = this.getSubscriptionData(data);
    if (subData.meal_types.length >= this.ProgramDetails.min_meals) {
      if (data.valid) {
        this._NormalPlanService.getMeals(subData).subscribe((res: IProgramMealsResponse) => {
          this._NormalPlanService.SaveCurrentMeals(res.data);
          this._Router.navigate(['../step2'], {
            relativeTo: this._ActivatedRoute,
          });
        });
      } 
      else {
        if (this.translate.currentLang == 'ar') {
          this._ToastrService.error('تحقق من خطتك', 'فشل الاشتراك في البرنامج', { timeOut: 4000 });
        }
        else{
          this._ToastrService.error('Check your plan', 'Program Subscription Failed', { timeOut: 4000 });
        }
      }
    }
    else{
      this.ProgramDetailsForm.get("Type_of_Meals")?.setValue(false)
    }
  }

  getSubscriptionData(data: FormGroup) {
    let SelectedDate: Date = data.value.Start_Date;
    let SubscriptionData:ISubscriptionData_NormalPlan = {
      program_id: Number(this.program_id),
      subscription_days: data.value.Number_of_Days,
      start_date: SelectedDate.toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ),
      meal_types: this.getSelectedMeals().concat(this.getSelectedSnacks()),
      SnacksType: this.getSelectedSnacks(),
      delivery_days: this.getSelectedDeliveryDays(),
    };
    this._NormalPlanService.SaveSubData(SubscriptionData);
    return SubscriptionData;
  }

  getSelectedMeals(){
    const mealTyps = this.MealsType?.nativeElement?.children;
    let MealsCount: string[] = [];
    for (let i = 0; i < mealTyps.length; i++) {
      if (mealTyps[i]?.children[0]?.checked) {
        MealsCount.push(mealTyps[i].children[0].name);
      }
    }
    return MealsCount
  }

  getSelectedSnacks(){
    const SnacksType = this.SnacksType?.nativeElement?.children;
    let SnacksCount: string[] = [];
    if (SnacksType) {
      for (let i = 0; i < SnacksType.length; i++) {
        if (SnacksType[i]?.children[0]?.checked) {
          SnacksCount.push(SnacksType[i].children[0].name);
        }
      }
    }
    return SnacksCount
  }

  getSelectedDeliveryDays(){
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
  
  onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
    this._SharedService.onSelectedDate(SelectedDate, deliveredDays);
  }

  checkDeliveryDays(e: HTMLElement){
    this._SharedService.checkDays(e, this.AllWeek, this.ProgramDetailsForm);
    this.getAllWeekChecked();
    this.getDeliveryMsg(e);
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

}
