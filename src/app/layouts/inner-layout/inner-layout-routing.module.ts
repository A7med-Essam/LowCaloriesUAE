import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import { InnerLayoutComponent } from './inner-layout/inner-layout.component';

const routes: Routes = [
  {
    path:'',
    component:InnerLayoutComponent,
    children: [
      {path:'',redirectTo:'home',pathMatch:'full'},
      {
        path:'home',
        component:LandingComponent
      },
      {
        path: 'contacts',
        loadChildren: () => import('../../modules/contacts/contacts.module').then(m => m.ContactsModule)
      },
      {
        path: 'plans',
        loadChildren: () => import('../../modules/plans/plans.module').then(m => m.PlansModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../../modules/menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'clinic',
        loadChildren: () => import('../../modules/clinic/clinic.module').then(m => m.ClinicModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../modules/profile/profile.module').then(m => m.ProfileModule),
        canActivate:[AuthGuard]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnerLayoutRoutingModule { }
