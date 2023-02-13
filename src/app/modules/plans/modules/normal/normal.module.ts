import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NormalRoutingModule } from './normal-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { Step3Component } from './components/step3/step3.component';


@NgModule({
  declarations: [
    Step1Component,
    Step2Component,
    Step3Component
  ],
  imports: [
    CommonModule,
    NormalRoutingModule,
    SharedModule,
  ]
})
export class NormalModule { 

}
