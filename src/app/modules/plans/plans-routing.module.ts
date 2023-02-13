import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyPlansComponent } from './monthly-plan/monthly-plans.component';

const routes: Routes = [
  { path: '', redirectTo: 'monthly-plans', pathMatch: 'full' },
  {
    path: 'monthly-plans',
    component:MonthlyPlansComponent
  },
  {
    path: 'normal/:Program_id',
    loadChildren: () => import('./modules/normal/normal.module').then(
      (m) => m.NormalModule
    )
  },
  {
    path: 'custom/:Program_id',
    loadChildren: () => import('./modules/custom/custom.module').then(
      (m) => m.CustomModule
    )
  },
  {
    path: 'programs/:layer_id',
    loadChildren: () => import('./modules/programs/programs.module').then(
      (m) => m.ProgramsModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
