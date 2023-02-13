import { Component, ElementRef, OnInit } from '@angular/core';
import { LocationService } from 'src/app/shared/services/location/location.service';
import {
  faLocationDot,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import {
  IArea,
  ICreateAddress,
  IEmirate,
  IUpdateAddress,
} from 'src/app/shared/interfaces/location';
import {
  IAddressResponse,
  IAreasResponse,
  IEmirateResponse,
} from 'src/app/shared/interfaces/HttpResponse';
import { IUserProfile_Address } from 'src/app/shared/interfaces/profile';

@Component({
  selector: 'app-my-addresses',
  templateUrl: './my-addresses.component.html',
  styleUrls: ['./my-addresses.component.scss'],
})
export class MyAddressesComponent implements OnInit {
  Addresses: IUserProfile_Address[] = [];
  faLocation = faLocationDot;
  faEdit = faEdit;
  faDelete = faTrashAlt;
  addNewAddressModal: boolean = false;
  editAddressModal: boolean = false;
  AddressForm: FormGroup = new FormGroup({});
  editAddressForm: FormGroup = new FormGroup({});
  emirate: IEmirate[] = [];
  Areas: IArea[] = [];

  constructor(
    private _LocationService: LocationService,
    private confirmationService: ConfirmationService,
    private el: ElementRef,
    private _FormBuilder: FormBuilder,
    private _SharedService: SharedService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAddresses();
    this.setAddressForm();
    this.setEditAddressForm();
    this.getEmirates();
  }

  setAddressForm() {
    this.AddressForm = this._FormBuilder.group({
      address: new FormControl(null, Validators.required),
      area_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
    });
  }

  setEditAddressForm(Address?: IUserProfile_Address) {
    this.editAddressForm = this._FormBuilder.group({
      address: new FormControl(null, Validators.required),
      address_id: new FormControl(null),
      area_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
    });
    if (Address) {
      this.setForm(Address);
    }
  }

  setForm(Address: IUserProfile_Address) {
    this.getAllAreasById(Address);
  }

  addNewAddress(data: FormGroup) {
    if (data.valid) {
      delete data.value.city_id;
      let AddressData: ICreateAddress = this._SharedService.getFormData(
        data.value
      ) as any as ICreateAddress;
      this._LocationService
        .createAddress(AddressData)
        .subscribe((res: IAddressResponse) => {
          this.getAddresses();
        });
    }
  }

  getAddresses() {
    this._LocationService.getAddresses().subscribe((res: IAddressResponse) => {
      this.Addresses = [...res.data];
      if (this.translate.currentLang == 'ar') {
        this.Addresses.forEach((e) => {
          e.area.emirate.name = e.area.emirate.name_ar;
          e.area.area_en = e.area.area_ar;
        });
      }
    });
  }

  confirm(AddressesId: number) {
    setTimeout(() => {
      if (this.translate.currentLang == 'ar') {
        let dialogBtn1 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-reject .p-button-label'
        );
        dialogBtn1.textContent = 'الرجوع';
        let dialogBtn2 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-accept .p-button-label'
        );
        dialogBtn2.textContent = 'حذف';
      } else {
        let dialogBtn1 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-reject .p-button-label'
        );
        dialogBtn1.textContent = 'Back';
        let dialogBtn2 = this.el.nativeElement.querySelector(
          '.p-confirm-dialog-accept .p-button-label'
        );
        dialogBtn2.textContent = 'Delete';
      }
    }, 1);
    if (this.translate.currentLang == 'ar') {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد أنك تريد حذف هذا العنوان؟',
        accept: () => {
          this._LocationService.deleteAddress(AddressesId).subscribe((res) => {
            this.getAddresses();
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this address?',
        accept: () => {
          this._LocationService.deleteAddress(AddressesId).subscribe((res) => {
            this.getAddresses();
          });
        },
      });
    }
  }

  getAllAreas(emirate_id: HTMLInputElement) {
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: emirate_id.value,
    }) as any as number;
    this._LocationService.getAreas(id).subscribe((res: IAreasResponse) => {
      res.data.forEach((Area: IArea) => this.Areas.push(Area));
    });
  }

  async getAllAreasById(Address: IUserProfile_Address) {
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: Address.area.emirate?.id,
    }) as any as number;
    await this._LocationService
      .getAreas(id)
      .subscribe((res: IAreasResponse) => {
        res.data.forEach((Area: IArea) => this.Areas.push(Area));
        if (Address) {
          this.editAddressForm.controls['address'].setValue(Address.address);
          this.editAddressForm.controls['address_id'].setValue(Address.id);
          this.editAddressForm.controls['area_id'].setValue(Address.area.id);
          this.editAddressForm.controls['city_id'].setValue(
            Address.area.emirate?.id
          );
        }
      });
  }

  getEmirates() {
    this.emirate = [];
    this._LocationService.getEmirates().subscribe((res: IEmirateResponse) => {
      res.data.forEach((Emirate: IEmirate) => this.emirate.push(Emirate));
    });
  }

  editAddress(data: FormGroup) {
    if (data.valid) {
      delete data.value.city_id;
      let AddressData: IUpdateAddress = this._SharedService.getFormData(
        data.value
      ) as any as IUpdateAddress;
      this._LocationService
        .updateAddress(AddressData)
        .subscribe((res: IAddressResponse) => {
          this.getAddresses();
        });
    }
  }
}
