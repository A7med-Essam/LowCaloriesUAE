import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  // HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
// import {environment} from 'src/environments/environment';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/shared/services/local.service';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { IDefaultResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ApiService } from '../services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = '';
  constructor(
    private _AuthService: AuthService,
    private _SharedService: SharedService,
    private _ToastrService: ToastrService,
    private _ApiService: ApiService,
    // private http:HttpClient,
    private _Router: Router,
    private _LocalService: LocalService
  ) {
    _AuthService.currentUser.subscribe((res: IUser) => {
      if (res == null) {
        this.token = '';
      } else {
        this.token = res.token;
        setTimeout(() => {
          this.checkToken().subscribe((res: IDefaultResponse) => {
            if (res.status == 0) {
              if (this._LocalService.getJsonValue('currentLang') == 'ar') {
                this._ToastrService.warning('لقد انتهي صلاحية حسابك', '', {
                  timeOut: 4000,
                });
              } else {
                this._ToastrService.warning(
                  'Your old session has been expired',
                  '',
                  { timeOut: 4000 }
                );
              }
              this._AuthService.logOut();
              this._Router.navigate(['./home']);
            }
          });
        }, 1);
      }
    });
  }

  checkToken(): Observable<IDefaultResponse> {
    // let token: number = this._SharedService.getFormData({token: this.token}) as number;
    // return this.http.post(environment.UrlEndPoint + 'checkToken', token)
    return this._ApiService.postReq('checkToken', { token: this.token });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let HttpHeader;

    if (this._LocalService.getJsonValue('currentLang') == 'ar') {
      HttpHeader = request.clone({
        headers: request.headers
          .set('Accept', ['application/json'])
          .set('Authorization', `Bearer ${this.token}`)
          .set(
            'api_password',
            `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY1Mjg2NjczOSwiZXhwIjoxNjUyODcwMzM5LCJuYmYiOjE2NTI4NjY3MzksImp0aSI6InFkTnN1NTZ2ZFYwQkhjOU4iLCJzdWIiOjQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Dk_4v17X5MuTD16LCZImtB4BvwvN30HgTM-OtNtE-Ck`
          )
          .set('lang', 'ar'),
      });
    } else {
      HttpHeader = request.clone({
        headers: request.headers
          .set('Accept', ['application/json'])
          .set('Authorization', `Bearer ${this.token}`)
          .set(
            'api_password',
            `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY1Mjg2NjczOSwiZXhwIjoxNjUyODcwMzM5LCJuYmYiOjE2NTI4NjY3MzksImp0aSI6InFkTnN1NTZ2ZFYwQkhjOU4iLCJzdWIiOjQsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Dk_4v17X5MuTD16LCZImtB4BvwvN30HgTM-OtNtE-Ck`
          )
          .set('lang', 'en'),
      });
    }
    return next.handle(HttpHeader);
  }
}
