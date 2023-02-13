import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanDetailsRoutingModule } from './plan-details-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { WeeksComponent } from './weeks/weeks.component';
import { ParentComponent } from './parent/parent.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { PrimeNGModule } from 'src/app/shared/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    ParentComponent,
    CalendarComponent,
    WeeksComponent,
  ],
  imports: [
    CommonModule,
    PlanDetailsRoutingModule,
    PrimeNGModule,
    I18nModule
  ]
})
export class PlanDetailsModule { }