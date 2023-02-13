import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {PrimeNGModule} from './prime-ng/prime-ng.module';
import { CheckoutComponent } from './components/checkout/checkout.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule } from './i18n/i18n.module';

@NgModule({
  declarations: [
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    PrimeNGModule,
    I18nModule
  ],
  exports: [
    CarouselModule,
    PrimeNGModule,
    FontAwesomeModule,
    CheckoutComponent,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    I18nModule
  ]
})

export class SharedModule {

}
