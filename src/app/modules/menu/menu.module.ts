import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';


@NgModule({
  declarations: [
    MenuComponent,
    ShoppingCartComponent,
    CheckoutCartComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule
  ]
})
export class MenuModule { }
