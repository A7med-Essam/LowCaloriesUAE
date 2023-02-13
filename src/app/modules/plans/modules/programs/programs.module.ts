import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramsRoutingModule } from './programs-routing.module';
import { ProgramsComponent } from './components/programs/programs.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProgramsComponent
  ],
  imports: [
    CommonModule,
    ProgramsRoutingModule,
    SharedModule
  ]
})
export class ProgramsModule { }
