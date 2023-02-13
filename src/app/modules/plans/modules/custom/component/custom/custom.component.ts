import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CustomPlanService } from 'src/app/shared/services/plans/custom-plan.service';
import { ICardsOfDates, ICategories, ICustomProgramsDetails, ICustom_detail, IMealDetailsUnique, ISubscribtionDetails, ISubscriptionData } from 'src/app/shared/interfaces/customPlan';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
// import { PlansService } from 'src/app/shared/services/plans/plans.service';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { ICustomProgramsDetailsResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ICheckOutPrice } from 'src/app/shared/interfaces/checkout';
// import { IPrograms } from 'src/app/shared/interfaces/plans';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {
  currIndex:number = 1;
  @ViewChild('indicators') indicators!: ElementRef;
  @ViewChild('progressElm') progressElm!: ElementRef;
  @ViewChild('nextBtn') nextBtn!: ElementRef;
  @ViewChild('prevBtn') prevBtn!: ElementRef;
  Programs!:ICustomProgramsDetails;
  custom_detail:ICustom_detail[] = [];
  isLoaded:boolean = false;
  custom_program_id!:number;
  @Input() checkOutPrice!:ICheckOutPrice;

  constructor(
    private _CustomPlanService:CustomPlanService,
    private _SharedService:SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _I18nService: I18nService,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe( params =>{
      let program_id:number = Number(params.get('Program_id'));
      this.getCustomPrograms(program_id);
      this.custom_program_id = program_id;
    })
  }
  
  getCustomPrograms(program_id:number){
    let id:number = this._SharedService.getFormData({"program_id":program_id}) as any as number
    this._CustomPlanService.getCustomProgramDetails(id).subscribe( (res:ICustomProgramsDetailsResponse) =>{
      this.Programs = res.data;
      this.custom_detail = res.data.custom_detail
      this.isLoaded = true;
      if (this.translate.currentLang == 'ar') {
        this.Programs.name = this.Programs.name_ar
        this.Programs.description = this.Programs.description_ar
      }
    })
  }

  next() {
      this.currIndex++;
      this.indicators.nativeElement.children[this.currIndex].style.transitionDelay = "0.6s";
      this.indicators.nativeElement.children[this.currIndex].classList.add("completed");
      this.progressElm.nativeElement.style.width = `${((this.currIndex -1) / (this.indicators.nativeElement.children.length -2)) * 100}%`;
      setTimeout(() => {
        if (this.currIndex == 2) {
          this.nextBtn.nativeElement.classList.add("disabled")
        }
      }, 1);
  }

  previous() {
      this.indicators.nativeElement.children[this.currIndex].style.transitionDelay = "0s";
      this.indicators.nativeElement.children[this.currIndex].classList.remove("completed");
      this.currIndex --;
      this.progressElm.nativeElement.style.width = `${((this.currIndex-1) / (this.indicators.nativeElement.children.length - 2)) * 100}%`;
      setTimeout(() => {
        if (this.currIndex == 2) {
          this.nextBtn.nativeElement.classList.add("disabled")
        }
        if (this.currIndex == 1) {
          this.NumberOfSnacks = '0';
        }
      }, 1);
  }

  NumberOfMeals!:string;
  countChangedHandler1(counter:HTMLInputElement){
    this.NumberOfMeals = counter.value;
      if (counter.classList.contains("meals")) {
        if ( parseInt(counter.value) >= parseInt(counter.min)) {
          this.nextBtn.nativeElement.classList.remove("disabled")
        } 
        else {
          this.nextBtn.nativeElement.classList.add("disabled")
        }
      }
  }

  NumberOfSnacks!:string;
  countChangedHandler2(counter:HTMLInputElement){
    this.NumberOfSnacks = counter.value;
      if (counter.classList.contains("meals")) {
        if ( parseInt(counter.value) >= parseInt(counter.min)) {
          this.nextBtn.nativeElement.classList.remove("disabled")
        } 
        else {
          this.nextBtn.nativeElement.classList.add("disabled")
        }
      }
  }
  
  SubscribtionDetailsData!:ISubscribtionDetails;
  SubscribtionDetailsDataHandler(e:ISubscriptionData){
    let data = {
      sub_days:Number(e.sub_days),
      start_date:e.start_date,
      delivery_days:e.delivery_days,
      meal_count:Number(this.NumberOfMeals),
      snack_count:this.NumberOfSnacks?Number(this.NumberOfSnacks):0,
      program_id:Number(this.custom_program_id)
    }
    this.SubscribtionDetailsData = data;
  }

  getFormStatus(isValid:boolean){
      if (isValid) {
        this.nextBtn.nativeElement.classList.remove("disabled")
      } 
      else {
        this.nextBtn.nativeElement.classList.add("disabled")
      }
  }

  getPrice(e:ICheckOutPrice){
    this.checkOutPrice = e;
  }

  getSelectedMealsStatus(e:boolean){
    if (e) {
      this.nextBtn.nativeElement.classList.remove("disabled")
    }
    else{
      this.nextBtn.nativeElement.classList.add("disabled")
    }
  }
  
  ClientMeals:IMealDetailsUnique[] = [];
  getSelectedMeals(e:IMealDetailsUnique[]){
    this.ClientMeals = e;
  }

  Cards!:ICardsOfDates[];
  getCardsOfDates(e:ICardsOfDates[]){
    this.Cards = e;
  }

  cat!:ICategories[];
  getCategories(e:ICategories[]){
    this.cat = e;
  }
}






