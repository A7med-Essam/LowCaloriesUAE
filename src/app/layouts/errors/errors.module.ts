import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsRoutingModule } from './errors-routing.module';
import { NotFound404Component } from './not-found404/not-found404.component';

@NgModule({
  declarations: [
    NotFound404Component,
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { 

}
