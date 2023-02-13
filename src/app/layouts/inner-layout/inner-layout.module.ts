import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InnerLayoutRoutingModule } from './inner-layout-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InnerLayoutComponent } from './inner-layout/inner-layout.component';
import { LandingComponent } from './components/landing/landing.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [
    NavbarComponent,
    InnerLayoutComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    InnerLayoutRoutingModule,
  ]
})
export class InnerLayoutModule { 

}
