import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import {
  IDayDetails,
  IPlanDetails,
  IPlanWeeks,
} from 'src/app/shared/interfaces/calendar';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CalendarService } from 'src/app/shared/services/plans/calendar.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileInfoService } from 'src/app/shared/services/profile/profile-info.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  CID!: string | null;
  planStatus: boolean = true;
  planDetails: IPlanDetails[] = [];
  currentTap: number = 1;
  planWeeks!: IPlanWeeks[][];

  toggle(n: number) {
    this.currentTap = n;
  }

  constructor(
    private _AuthService: AuthService,
    private _ProfileInfoService: ProfileInfoService,
    private _SharedService: SharedService,
    private _I18nService: I18nService,
    private _CalendarService: CalendarService,
    private _Router: Router,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate);
  }

  ngOnInit(): void {
    this.getCid();
    this.getPlanStatus();
    this.getUser();
    this.getPlanDetails();
  }

  logout() {
    this._AuthService.logOut();
  }

  importImage(userImage: any) {
    let input: any = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    let base64: any = null;
    input.onchange = () => {
      let files = Array.from(input.files);
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
            userImage.src = e.target.result;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          if (base64) {
            this.updateProfileImage(base64.result);
          }
        }, 500);
      }
    };
    input.click();
  }

  toggleImage(e: HTMLElement) {
    if (e.classList.contains('active')) {
      let src1 = e.children[0].getAttribute('src1');
      if (src1) {
        e.children[0].setAttribute('src', src1);
      }
    } else {
      let src2 = e.children[0].getAttribute('src2');
      if (src2) {
        e.children[0].setAttribute('src', src2);
      }
    }
    let siblings = this._SharedService
      .getAllSiblings(e.parentElement, e.parentElement)
      .slice(0, -1);
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].classList.contains('active')) {
        let src1 = siblings[i].children[0].getAttribute('src1');
        if (src1) {
          siblings[i].children[0].setAttribute('src', src1);
        }
      } else {
        let src2 = siblings[i].children[0].getAttribute('src2');
        if (src2) {
          siblings[i].children[0].setAttribute('src', src2);
        }
      }
    }
  }

  toggleCalendar: boolean = false;
  getDetails(e: any) {
    this.toggleCalendar = e;
  }

  user!: IUser;
  getUser() {
    this._AuthService.currentUser.subscribe((res: any) => {
      this.user = res;
    });
  }

  getPlanDetails() {
    if (this.CID) {
      // this._CalendarService.getPlanDetails("35000").subscribe((res:any)=>{
      //   if (this.planStatus) {
      //     this.planDetails = res.data
      //   }
      //   else{
      //     this.planWeeks = res.data;
      //   }
      // })

      if (this.planStatus) {
        this._CalendarService.getPlanDetails('35000').subscribe((res: any) => {
          this.planDetails = res.data;
        });
      } else {
        this._CalendarService.getPlanDetails(this.CID).subscribe((res: any) => {
          this.planWeeks = res.data;
          if (res.status == 0) {
            this._Router.navigate(['../profile/controls/2']);
          }
        });
      }
    }
  }

  getCid() {
    this._CalendarService.currentCid.subscribe((res) => {
      if (res) {
        this.CID = res;
      } else {
        this._Router.navigate(['./profile/controls/2']);
      }
    });
  }

  getPlanStatus() {
    this._CalendarService.planStatus.subscribe((res) => {
      if (res == 'active' || res == 'مفعله') {
        this.planStatus = true;
        this.currentTap = 1;
      } else {
        this.planStatus = false;
        this.currentTap = 2;
      }
    });
  }

  DayDetails!: IDayDetails;
  getDayDetails(e: any) {
    this.planDetails.filter((res) => {
      if (res.date == e) {
        this.DayDetails = res;
      }
    });
  }

  Profile_content!: HTMLElement;
  @ViewChild('content') set ft0(content: any) {
    this.Profile_content = content.nativeElement;
  }
  scrollToContent = () => {
    this.Profile_content.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  updateProfileImage(image: File) {
    this._ProfileInfoService.updateProfileImage(image).subscribe((res) => {
      this._AuthService.saveUser(res.data);
    });
  }
}
