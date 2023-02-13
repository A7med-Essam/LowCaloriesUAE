import { Component, OnInit } from '@angular/core';
import { IProfilePlansResponse, IProfileResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IProfilePlans, IUserProfile } from 'src/app/shared/interfaces/profile';
import { CalendarService } from 'src/app/shared/services/plans/calendar.service';
import { PlansService } from 'src/app/shared/services/plans/plans.service';
import { ProfileInfoService } from 'src/app/shared/services/profile/profile-info.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  constructor(
    private _PlansService:PlansService,
    private _ProfileInfoService:ProfileInfoService,
    private _CalendarService:CalendarService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }
  user!:IUserProfile;
  plans:IProfilePlans[] = [];

  getPlans(){
    this._PlansService.getMyPlans().subscribe((res:IProfilePlansResponse)=>{
      this.plans = res.data;
    })
  }

  getUserInfo(){
    this._ProfileInfoService.getUserInfo().subscribe(
      (res:IProfileResponse)=>{
        this.user = res.data;
        this.getPlans();
      }
    );
  }

  getCid(cid:number,status:string){
    this._CalendarService.currentCid.next(cid.toString())
    this._CalendarService.planStatus.next(status)
  }

}
