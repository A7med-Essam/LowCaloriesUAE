import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(
      (m) => m.AuthLayoutModule
    )
  },
  {
    path: '',
    loadChildren: () => import('./layouts/inner-layout/inner-layout.module').then(
      (m) => m.InnerLayoutModule
    )
  },
  {
    path: '**',
    loadChildren: () => import('./layouts/errors/errors-routing.module').then(
      (m) => m.ErrorsRoutingModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true } )], //, enableTracing: true , scrollPositionRestoration : "top" 
  exports: [RouterModule],
})
export class AppRoutingModule { }
