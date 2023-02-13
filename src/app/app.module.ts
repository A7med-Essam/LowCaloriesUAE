import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/http.interceptor';

import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ngxUiLoaderConfig } from "./shared/models/ngxUiLoaderConfig";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS , useClass:AuthInterceptor , multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
