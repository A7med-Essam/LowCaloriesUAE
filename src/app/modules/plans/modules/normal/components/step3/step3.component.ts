import { Component, OnInit } from '@angular/core';
import { ICheckOutPrice } from 'src/app/shared/interfaces/checkout';
import { ICheckOutPriceResponse } from 'src/app/shared/interfaces/HttpResponse';
import { INormalProgramDetails, IProgramPrice, ISubscriptionData_NormalPlan } from 'src/app/shared/interfaces/normalPlan';
import { NormalPlanService } from 'src/app/shared/services/plans/normal-plan.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {
  ProgramPrices!:ICheckOutPrice;
  SubscribtionData!:ISubscriptionData_NormalPlan;
  plan_name:string = 'normal';
  Menu_Name:string = '';
  plan_img:string = '';
  
  constructor(
    private _NormalPlanService:NormalPlanService,
  ) { }

  ngOnInit(): void {
    this.getCheckOutInfo();
  }

  getCheckOutInfo(){
    this._NormalPlanService.SubscriptionData.subscribe( (res:ISubscriptionData_NormalPlan) => {
      this.SubscribtionData = res;
      const subData:IProgramPrice = {
        program_id:res?.program_id,
        meal_count:(Number(res?.meal_types.length)-Number(res?.SnacksType.length)),
        snack_count:res?.SnacksType.length,
        subscription_day_count:res?.subscription_days
      }
      this.getCheckOutPrice(subData)
      this.getProgramInfo()
    })
  }

  getCheckOutPrice(data:IProgramPrice){
    this._NormalPlanService.getProgramPrice(data).subscribe( (res:ICheckOutPriceResponse) => {
      this.ProgramPrices = res.data
    })
  }

  getProgramInfo(){
    this._NormalPlanService.ProgramDetails.subscribe((res:INormalProgramDetails)=>{
      this.Menu_Name = res.name
      this.plan_img = res.image
    })
  }

}
