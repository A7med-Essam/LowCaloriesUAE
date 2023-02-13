import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { LangComponent } from './components/lang/lang.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'lang', pathMatch: 'full' },
      { path: 'lang', component:LangComponent },
      { path: 'login', component:LoginComponent },
      { path: 'register', component:RegisterComponent },
      { path: 'forgot-password', component:ForgetPasswordComponent },
      { path: 'reset-password', component:ResetPasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule { }
