import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicRoutingModule } from './clinic-routing.module';
import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParentComponent } from './components/parent/parent.component';


@NgModule({
  declarations: [
    Step1Component,
    Step2Component,
    ParentComponent
  ],
  imports: [
    CommonModule,
    ClinicRoutingModule,
    SharedModule
  ]
})
export class ClinicModule { }
