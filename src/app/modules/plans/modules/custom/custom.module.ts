import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomRoutingModule } from './custom-routing.module';
import { CustomComponent } from './component/custom/custom.component';
import { Step1Component } from './component/custom/step1/step1.component';
import { Step2Component } from './component/custom/step2/step2.component';
import { Step3Component } from './component/custom/step3/step3.component';
import { Step4Component } from './component/custom/step4/step4.component';
import { Step5Component } from './component/custom/step5/step5.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CustomComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component
  ],
  imports: [
    CommonModule,
    CustomRoutingModule,
    SharedModule,
  ]
})
export class CustomModule { }
