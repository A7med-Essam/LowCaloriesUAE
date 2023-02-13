import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICheckOutPrice } from 'src/app/shared/interfaces/checkout';
import { ICustomProgramsDetails, ISubscribtionDetails } from 'src/app/shared/interfaces/customPlan';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss']
})
export class Step5Component implements OnInit {
  @Input() checkOutPrice!:ICheckOutPrice;
  @Input() SubscribtionData!:ISubscribtionDetails;
  @Input() ProgramDetails!:ICustomProgramsDetails;
  Menu_Name:string = '';
  plan_img:string = '';
  plan_name:string = 'custom';

  constructor(
    private translate:TranslateService
  ) { }
  
  ngOnInit(): void {
    if (this.translate.currentLang == 'ar') {
      this.Menu_Name = this.ProgramDetails.name_ar
    }
    else{
      this.Menu_Name = this.ProgramDetails.name
    }
    this.plan_img = this.ProgramDetails.image
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event:Event) {
    return false;
  }

}
