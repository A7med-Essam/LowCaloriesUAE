import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { PlansComponent } from './components/plans/plans.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TermsComponent } from './components/terms/terms.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AskUsComponent } from './components/ask-us/ask-us.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuComponent } from './components/menu/menu.component';
import { MyAddressesComponent } from './components/my-addresses/my-addresses.component';
import { BranchesComponent } from './components/branches/branches.component';
import { BranchDetailsComponent } from './components/branch-details/branch-details.component';
import { ChatWithUsComponent } from './components/chat-with-us/chat-with-us.component';


@NgModule({
  declarations: [
    ProfileComponent,
    PersonalInformationComponent,
    PlansComponent,
    SettingsComponent,
    NotificationsComponent,
    TermsComponent,
    ChangePasswordComponent,
    AskUsComponent,
    MenuComponent,
    MyAddressesComponent,
    BranchesComponent,
    BranchDetailsComponent,
    ChatWithUsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
