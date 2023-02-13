import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { ProfileInfoService } from 'src/app/shared/services/profile/profile-info.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currIndex: number = 1;

  Profile_PersonalInfo!: HTMLElement;
  @ViewChild('PersonalInfo') set ft1(PersonalInfo: ElementRef) {
    this.Profile_PersonalInfo = PersonalInfo.nativeElement;
  }

  Profile_Plans!: HTMLElement;
  @ViewChild('Plans') set ft2(Plans: ElementRef) {
    this.Profile_Plans = Plans.nativeElement;
  }

  Profile_Addresses!: HTMLElement;
  @ViewChild('Addresses') set ft3(Addresses: ElementRef) {
    this.Profile_Addresses = Addresses.nativeElement;
  }

  Profile_ChangePassword!: HTMLElement;
  @ViewChild('ChangePassword') set ft4(ChangePassword: ElementRef) {
    this.Profile_ChangePassword = ChangePassword.nativeElement;
  }

  Profile_Menu!: HTMLElement;
  @ViewChild('Menu') set ft5(Menu: ElementRef) {
    this.Profile_Menu = Menu.nativeElement;
  }

  Profile_Chat!: HTMLElement;
  @ViewChild('Chat') set ft6(Chat: ElementRef) {
    this.Profile_Chat = Chat.nativeElement;
  }

  Profile_Ask!: HTMLElement;
  @ViewChild('Ask') set ft7(Ask: ElementRef) {
    this.Profile_Ask = Ask.nativeElement;
  }

  Profile_Settings!: HTMLElement;
  @ViewChild('Settings') set ft8(Settings: ElementRef) {
    this.Profile_Settings = Settings.nativeElement;
  }

  constructor(
    private _AuthService: AuthService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _LocalService: LocalService,
    private _Router: Router,
    private _I18nService: I18nService,
    public translate: TranslateService,
    private _ProfileInfoService: ProfileInfoService
  ) {
    this._I18nService.saveCurrentLang(this.translate);
  }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      let program_id = params.get('id');
      setTimeout(() => {
        this.toggleProfile(
          Number(program_id),
          this.getCurrentTap(Number(program_id))
        );
      }, 1);
    });
    this.getUser();
  }

  getCurrentTap(n: number) {
    switch (n) {
      case 1:
        return this.Profile_PersonalInfo;
      case 2:
        return this.Profile_Plans;
      case 3:
        return this.Profile_Addresses;
      case 4:
        return this.Profile_ChangePassword;
      case 5:
        return this.Profile_Menu;
      case 6:
        return this.Profile_Chat;
      case 7:
        return this.Profile_Ask;
      case 8:
        return this.Profile_Settings;
      default:
        return this.Profile_PersonalInfo;
    }
  }

  toggleProfile(n: number, e: HTMLElement) {
    this.currIndex = n;
    this.toggleActiveClass(e);
    this.toggleImage(e);
    if (n == 6) {
      window.open(
        this.getLinkWhastapp('971505025430', 'Hello i have a problem!'),
        '_blank'
      );
    }
  }

  getLinkWhastapp(number: string, message: string) {
    var url =
      'https://api.whatsapp.com/send?phone=' +
      number +
      '&text=' +
      encodeURIComponent(message);
    return url;
  }

  toggleActiveClass(e: HTMLElement) {
    let siblings = this._SharedService
      .getAllSiblings(e.parentElement, e.parentElement)
      .slice(0, -1);
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].classList.contains('active')) {
        siblings[i].classList.remove('active');
      }
    }
    e.classList.add('active');
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

  logout() {
    this._AuthService.logOut();
  }

  getNotifications(e: number) {
    this.currIndex = e;
  }

  getTerms(e: number) {
    this.currIndex = e;
  }

  importImage(userImage: HTMLImageElement) {
    let input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    let base64: any = null;
    input.onchange = () => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
            userImage.src = `${e.target.result}`;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          if (input.files) {
            this.updateProfileImage(input.files[0]);
          }
        }, 500);
      }
    };
    input.click();
  }

  getBranchDetails(e: number) {
    this.currIndex = e;
  }

  branchId!: number;
  getBranchId(e: number) {
    this.branchId = e;
  }

  getBranches(e: number) {
    this.currIndex = e;
  }

  getMenu(e: number) {
    this._Router.navigate(['/profile/controls/' + e]);
    this.currIndex = e;
  }

  user!: IUser;
  getUser() {
    this._AuthService.currentUser.subscribe((res: IUser) => {
      this.user = res;
    });
  }

  Profile_content!: HTMLElement;
  @ViewChild('content') set ft0(content: ElementRef) {
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
    let img: File = this._SharedService.getFormData({ image: image }) as any;
    this._ProfileInfoService.updateProfileImage(img).subscribe((res) => {
      this._AuthService.saveUser(res.data);
    });
  }
}
