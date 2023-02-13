import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import {
  IGiftCode_menu,
  IReceipt_WithAuth,
  IReceipt_WithoutAuth,
} from 'src/app/shared/interfaces/checkout';
import {
  IAddressResponse,
  IAreasResponse,
  ICheckOutPriceResponse,
  IEmirateResponse,
} from 'src/app/shared/interfaces/HttpResponse';
import { IArea, IEmirate } from 'src/app/shared/interfaces/location';
import { IMealDetails2 } from 'src/app/shared/interfaces/menu';
import { IUserProfile_Address } from 'src/app/shared/interfaces/profile';
import { LocalService } from 'src/app/shared/services/local.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss'],
})
export class CheckoutCartComponent implements OnInit {
  NewAddressForm: FormGroup = new FormGroup({});
  checkoutForm: FormGroup = new FormGroup({});
  Areas: IArea[] = [];
  emirate: IEmirate[] = [];
  shoppingCartItems: IMealDetails2[] = [];
  code_apply: number = 0;
  shoppingCartPrice: number = 0;
  total_price: number = 0;
  isLoggedIn: boolean = false;
  bag_price: number = 0;
  vat: number = 0.05;
  delivery_days: string[] = [];
  today: Date = new Date();
  constructor(
    private _FormBuilder: FormBuilder,
    private _LocationService: LocationService,
    private _SharedService: SharedService,
    public translate: TranslateService,
    private _Router: Router,
    private _ToastrService: ToastrService,
    private _LocalService: LocalService,
    private _MenuService: MenuService
  ) {
    this.delivery_days = [
      'SATURDAY',
      'SUNDAY',
      'MONDAY',
      'TUSEDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ];
  }

  ngOnInit(): void {
    this.setNewAddressForm();
    this.setCheckoutForm();
    this.shoppingCartItems = this._MenuService.shoppingCartItems.value;
    if (this.shoppingCartItems == null || !this.shoppingCartItems.length) {
      this._Router.navigate(['/home']);
    }
    if (this._LocalService.getJsonValue('userInfo') != null) {
      this.isLoggedIn = true;
    } else {
      this.getEmirates();
    }
    this.getPrice();
    this.getAddresses();
    this.get_vat_bagPrice();
  }

  getPrice() {
    let listOfPrices: number[] = [];
    this.shoppingCartItems.forEach((e: IMealDetails2) => {
      listOfPrices.push(e.price);
    });
    this.shoppingCartPrice = this.total_price = listOfPrices.reduce(
      (a, b) => a + b
    );
  }

  setNewAddressForm() {
    this.NewAddressForm = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[\\d]{10}$'),
      ]),
      emirate: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      delivery_days: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
    });
  }

  setCheckoutForm() {
    this.checkoutForm = this._FormBuilder.group({
      delivery_days: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      address_id: new FormControl(null, [Validators.required]),
    });
  }

  getEmirates() {
    this.emirate = [];
    this._LocationService.getEmirates().subscribe((res: IEmirateResponse) => {
      res.data.forEach((Emirate: IEmirate) => this.emirate.push(Emirate));
      if (this.translate.currentLang == 'ar') {
        this.emirate.map((e) => {
          e.name = e.name_ar;
        });
      }
    });
  }

  getAreas(emirate_id: number) {
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: emirate_id,
    }) as any as number;
    this._LocationService.getAreas(id).subscribe((res: IAreasResponse) => {
      res.data.forEach((Area: IArea) => this.Areas.push(Area));
      if (this.translate.currentLang == 'ar') {
        this.Areas.map((a) => {
          a.area_en = a.area_ar;
        });
      }
    });
  }

  getCartItemsId() {
    let ids: number[] = [];
    if (this.isLoggedIn) {
      this.shoppingCartItems.forEach((e) => {
        ids.push(e.cart_id);
      });
    } else {
      this.shoppingCartItems.forEach((e) => {
        ids.push(e.id);
      });
    }
    return ids;
  }

  // ********************* GiftCode ************
  applyGiftCode(GiftCodeInput: HTMLInputElement) {
    // let giftCodeFormData: IGiftCode_menu = this._SharedService.getFormData({
    //   code: GiftCodeInput?.value,
    //   price: this.shoppingCartPrice,
    //   item_ids: this.getCartItemsId(),
    // }) as any as IGiftCode_menu;

    const code: IGiftCode_menu = {
      code: GiftCodeInput.value,
      price: this.shoppingCartPrice,
      item_ids: this.getCartItemsId(),
    };
    this._MenuService.giftcode(code).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.total_price = res.data.grand_total;
          this.vat = res.data.vat;
          this.bag_price = res.data.bag_price;
          this.code_apply = res.data.code_apply;
        }
      },
    });
  }
  // ********************* Checkout ************
  checkoutWithAuth(form: FormGroup) {
    if (this.Addresses.length > 0) {
      let receipt: IReceipt_WithAuth = {
        cart_item_ids: this.getCartItemsId(),
        start_date: new Date(form.value.start_date)
          .toLocaleDateString('pt-br')
          .split('/')
          .reverse()
          .join('-'),
        delivery_days: [form.value.delivery_days],
        address_id: form.value.address_id,
        price: this.shoppingCartPrice,
        total_price: this.total_price,
        subscription_from: 'web',
      };
      this._MenuService.checkoutWithAuth(receipt).subscribe({
        next: (res) => {
          window.location.href = res.data;
        },
      });
    } else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.warning(
          'ليس لديك عنوان ، يرجى إضافة عنوان جديد',
          'الدفع',
          {
            timeOut: 3000,
          }
        );
      } else {
        this._ToastrService.warning(
          'you do not have an address, please add a new address',
          'Checkout',
          { timeOut: 3000 }
        );
      }
    }
  }

  checkoutWithoutAuth(form: FormGroup) {
    let receipt: IReceipt_WithoutAuth = {
      item_ids: this.getCartItemsId(),
      start_date: new Date(form.value.start_date)
        .toLocaleDateString('pt-br')
        .split('/')
        .reverse()
        .join('-'),
      delivery_days: [form.value.delivery_days],
      price: this.shoppingCartPrice,
      total_price: this.total_price,
      subscription_from: 'web',
      name: form.value.name,
      email: form.value.email,
      address: form.value.address,
      area_id: form.value.area_id,
      mobile: form.value.mobile,
    };
    this._MenuService.checkoutWithoutAuth(receipt).subscribe({
      next: (res) => {
        window.location.href = res.data;
      },
    });
  }

  // ******************* get address
  Addresses: IUserProfile_Address[] = [];
  getAddresses() {
    if (this.isLoggedIn) {
      this._LocationService
        .getAddresses()
        .subscribe((res: IAddressResponse) => {
          this.Addresses = res.data;
        });
    }
  }

  get_vat_bagPrice() {
    this._MenuService
      .giftcode_WithoutErrNotify({
        code: 'no code',
        price: this.shoppingCartPrice,
        item_ids: this.getCartItemsId(),
      })
      .subscribe({
        next: (res) => {
          this.vat = res.data.vat;
          this.bag_price = res.data.bag_price;
          this.code_apply = res.data.code_apply;
          this.total_price = res.data.grand_total;
        },
      });
  }
}
