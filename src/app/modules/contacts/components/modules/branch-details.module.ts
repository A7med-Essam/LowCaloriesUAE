import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchDetailsRoutingModule } from './branch-details-routing.module';
import { DetailsComponent } from './components/details/details.component';
import { BranchesComponent } from './components/branches/branches.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { SkeletonModule } from "primeng/skeleton";


@NgModule({
  declarations: [
    DetailsComponent,
    BranchesComponent
  ],
  imports: [
    CommonModule,
    BranchDetailsRoutingModule,
    I18nModule,
    SkeletonModule
  ]
})
export class BranchDetailsModule { }
