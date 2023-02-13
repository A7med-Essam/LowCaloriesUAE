import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './components/branches/branches.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'our-branches',
    pathMatch: 'full'
  },
  {
    path: 'our-branches',
    component:BranchesComponent
  },
  {
    path: 'details/:id',
    component:DetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchDetailsRoutingModule { }
