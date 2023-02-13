import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutCartComponent } from './checkout-cart/checkout-cart.component';
import { MenuComponent } from './menu.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu-page', pathMatch: 'full' },
  {
    path: 'menu-page',
    component:MenuComponent
  },
  {
    path: 'cart',
    component:ShoppingCartComponent
  },
  {
    path: 'checkout',
    component:CheckoutCartComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
