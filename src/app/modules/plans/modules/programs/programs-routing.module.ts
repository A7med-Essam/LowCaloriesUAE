import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramsComponent } from './components/programs/programs.component';

const routes: Routes = [
  { path: '', redirectTo: 'All-Programs', pathMatch: 'full' },
  {
    path: 'All-Programs',
    component:ProgramsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramsRoutingModule { }
