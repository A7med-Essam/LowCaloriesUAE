import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { Step3Component } from './components/step3/step3.component';

const routes: Routes = [
  { path: '', redirectTo: 'step1', pathMatch: 'prefix' },
  {
    path: 'step1',
    component:Step1Component
  },
  {
    path: 'step2',
    component:Step2Component
  },
  {
    path: 'checkout',
    component:Step3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormalRoutingModule { }
