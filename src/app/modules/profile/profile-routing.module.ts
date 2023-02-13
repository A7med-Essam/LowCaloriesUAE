import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'controls', pathMatch: 'full' },
  {
    path: 'controls/:id',
    component:ProfileComponent
  },
  {
    path: 'plan',
    loadChildren: () => import('./components/modules/plan-details/plan-details.module').then(
      (m) => m.PlanDetailsModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
