import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentComponent } from './components/parent/parent.component';

const routes: Routes = [
  { path: '', redirectTo: 'reservation', pathMatch: 'full' },
  {
    path: 'reservation',
    component:ParentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
