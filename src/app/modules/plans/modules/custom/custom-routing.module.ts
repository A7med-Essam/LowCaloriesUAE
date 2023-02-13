import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomComponent } from './component/custom/custom.component';

const routes: Routes = [
  { path: '', redirectTo: 'custom-plan', pathMatch: 'full' },
  {
    path: 'custom-plan',
    component: CustomComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomRoutingModule { }
