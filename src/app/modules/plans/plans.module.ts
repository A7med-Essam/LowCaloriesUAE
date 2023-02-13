import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansRoutingModule } from './plans-routing.module';
import { MonthlyPlansComponent } from './monthly-plan/monthly-plans.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { SkeletonModule } from "primeng/skeleton";


@NgModule({
  declarations: [
    MonthlyPlansComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    I18nModule,
    SkeletonModule
  ]
})
export class PlansModule { }
