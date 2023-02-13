import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { EmailUsComponent } from './components/email-us/email-us.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';

const routes: Routes = [
  { path: '', redirectTo: 'contact-us', pathMatch: 'full' },
  {
    path: 'contact-us',
    component:ContactUsComponent
  },
  {
    path: 'social-media',
    component:SocialMediaComponent
  },
  {
    path: 'email-us',
    component:EmailUsComponent
  },
  {
    path: 'branches',
    loadChildren: () => import('./components/modules/branch-details.module').then(
      (m) => m.BranchDetailsModule
    )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
