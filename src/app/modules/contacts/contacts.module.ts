import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { EmailUsComponent } from './components/email-us/email-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SocialMediaComponent,
    EmailUsComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    SharedModule
  ]
})
export class ContactsModule { }
