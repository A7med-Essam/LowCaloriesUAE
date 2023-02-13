import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { LocationService } from '../../services/location/location.service';
import { SharedService } from '../../services/shared.service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { faEnvelope, faEye, faLock, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ICheckOutPrice, ICustomCheckOut, ICustomCheckOut_WithAuth, IGiftCode, INormalCheckOut, INormalCheckOut_WithAuth } from '../../interfaces/checkout';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../i18n/i18n.service';
import { IAuthResponse, IDefaultResponse, ICheckOutPriceResponse, IEmirateResponse, IAreasResponse, IAddressResponse } from '../../interfaces/HttpResponse';
import { IArea, ICreateAddress, IEmirate } from '../../interfaces/location';
import { IUserProfile_Address } from '../../interfaces/profile';
import { ISubscriptionData_NormalPlan } from '../../interfaces/normalPlan';
import { ISubscribtionDetails } from '../../interfaces/customPlan';
import { TermsService } from '../../services/terms/terms.service';
import { ITerms } from '../../interfaces/terms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @Input() ProgramPrices!: ICheckOutPrice;
  @Input() SubscribtionData!: any | ISubscriptionData_NormalPlan | ISubscribtionDetails;
  @Input() Menu_Name!: string;
  @Input() plan_img!: string;
  @Input() plan_name!: string;
  @ViewChild('LocationBtn') LocationBtn!:ElementRef;

  loginForm: FormGroup = new FormGroup({});
  OldAddressForm: FormGroup = new FormGroup({});
  NewAddressForm: FormGroup = new FormGroup({});
  AddressForm: FormGroup = new FormGroup({});
  AddressForm2: FormGroup = new FormGroup({});
  isNewLocation:boolean = true;
  faTrash = faTrashCan;
  SelectedLocationId!:number;
  cities: IEmirate[] = [];
  Areas: IArea[] = [];
  Addresses!:IUserProfile_Address[];

  emirate: IEmirate[] = [];
  Areas2: IArea[] = [];

  isLogin:boolean = false;

  faEnvelope = faEnvelope;
  faEye = faEye;
  faLock = faLock;

  constructor(
    private _CheckoutService:CheckoutService,
    private _SharedService:SharedService,
    private _LocationService:LocationService,
    private _ToastrService: ToastrService,
    private _FormBuilder: FormBuilder,
    private _AuthService:AuthService,
    private _TermsService:TermsService,
    private _Router:Router,
    private cdr: ChangeDetectorRef,
    private _I18nService:I18nService,
    public translate: TranslateService
  ) { 
    this._I18nService.saveCurrentLang(this.translate)
  }

  ngAfterViewInit(): void {
    let btn = this.LocationBtn?.nativeElement as HTMLElement;
    this._AuthService.currentUser.subscribe(res=>{
      if (!res) {
        this.LocationBtn?.nativeElement?.setAttribute("data-bs-target",'#LoginModal')
        this.isLogin = false;
        if (this.translate.currentLang == 'ar') {
          btn.innerHTML = '<u>برجاء تسجيل الدخول لتتمكن من أسترداد عناوينك</u>'
        }
        else{
          btn.innerHTML = '<u>Login first to retrieve your locations</u>'
        }
      }
      else{
        if (this.translate.currentLang == 'ar') {
          btn.innerHTML = '<u>حدد موقعك الحالي</u>';
        }
        else{
          btn.innerHTML = '<u>Select Your Current Location</u>';
        }
        this.isLogin = true;
        this.getCities();
      }
    })
    if (this.SubscribtionData == null) {
      this._Router.navigate(['../plans/monthly-plans']);
    }
    this.cdr.detectChanges();
  }

  deliveryDays:any[] = [];
  ngOnInit(): void {
    this.setAddressForm2();
    this.setAddressForm();
    this.setCheckOutForm_Auth();
    this.setCheckOutForm();
    this.setLoginForm();
    this.getEmirates();
    this.SubscribtionData.delivery_days.forEach( (res:any) => {
      this.deliveryDays.push({en:res,ar:this.getWeekDaysInAr(res)})
    })
  }

  getWeekDaysInAr(day:string):string{
    switch (day.toLowerCase()) {
      case "saturday":
          return 'السبت'
      case "sunday":
        return 'الأحد'
      case "monday":
        return 'الإثنين'
      case "tuesday":
        return 'الثلاثاء'
      case "wednesday":
        return 'الأربعاء'
      case "thursday":
        return 'الخميس'
      default:
        return 'الجمعه'
    }
  }

  getEmirates(){
    this.emirate = [];
    this._LocationService.getEmirates().subscribe( (res:IEmirateResponse)=>{
      res.data.forEach((Emirate:IEmirate) => this.emirate.push(Emirate));
      if (this.translate.currentLang == 'ar') {
        this.emirate.map( e => {
          e.name = e.name_ar
        })
      }
    })
  }

  getAreas2(emirate_id:number){
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: emirate_id,
    }) as any as number;
    this._LocationService.getAreas(id).subscribe( (res:IAreasResponse)=>{
      res.data.forEach((Area:IArea) => this.Areas.push(Area));
      if (this.translate.currentLang == 'ar') {
        this.Areas.map( a => {
          a.area_en = a.area_ar
        })
      }
    })
  }

  setCheckOutForm_Auth(){
    this.OldAddressForm = this._FormBuilder.group({
      emirate: new FormControl(null, [Validators.required]),
      area: new FormControl(null, [Validators.required]),
      areaId: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      address_id: new FormControl(null, [Validators.required]),
      AcceptTerms: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  setCheckOutForm(){
    this.NewAddressForm = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, [Validators.required, Validators.pattern('^[\\d]{10}$')]),
      emirate: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  setLoginForm() {
    this.loginForm = this._FormBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onLoginSubmit(data:FormGroup) {
    if (data.valid) {
      this._AuthService.signIn(data.value).subscribe( (res:IAuthResponse) => {
          if (res.status == 1) {
            this._AuthService.saveUser(res.data);
            this.LocationBtn?.nativeElement?.setAttribute("data-bs-target",'#LocationModal')
          }
        });
    } 
    else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error('فشلت محاولة تسجيل الدخول', 'خطأ رئيسي في المصادقة', { timeOut: 3000 });
      }
      else{
        this._ToastrService.error('Login attempt failed', 'Authentication Major Error', { timeOut: 3000 });
      }
    }
  }

  togglePassword(PasswordInput:HTMLInputElement){
    if (this.faEye == faEye) {
        this.faEye = faEyeSlash;
        PasswordInput.type = "text";
      } 
    else {
      this.faEye = faEye;
      PasswordInput.type = "password";
    }
  }

  setAddressForm(){
    this.AddressForm = this._FormBuilder.group({
      'address' : new FormControl(null, Validators.required),
      'area_id' : new FormControl(null, Validators.required),
      'city_id' : new FormControl(null, Validators.required)
    })
  }

  setAddressForm2(){
    this.AddressForm2 = this._FormBuilder.group({
      'address' : new FormControl(null, Validators.required),
      'area_id' : new FormControl(null, Validators.required),
      'city_id' : new FormControl(null, Validators.required),
      'terms' : new FormControl(false, Validators.requiredTrue),
    })
  }

  applyGiftCode(GiftCodeInput:HTMLInputElement){
    let giftCodeFormData:IGiftCode = this._SharedService.getFormData(
    {
      code:GiftCodeInput?.value,
      price:this.ProgramPrices?.price,
      program_id:this.SubscribtionData?.program_id
    }) as any as IGiftCode
    this._CheckoutService.applyGiftCode(giftCodeFormData).subscribe((res:ICheckOutPriceResponse) =>{
      this.ProgramPrices = res.data
    })
  }

  getAddresses(){
    this._AuthService.currentUser.subscribe(UserResponse=>{
      if (UserResponse) {
        this._LocationService.getAddresses().subscribe( (res:IAddressResponse) =>{
            this.Addresses = [...res.data]
        })
      }
    })
  }

  setAddress(Address:HTMLElement, AddressId:HTMLInputElement,emirate:HTMLElement,area:HTMLElement, areaId:HTMLElement, SelectedBtn:HTMLElement){
    this.OldAddressForm.get('address')?.setValue(Address.innerHTML);
    this.OldAddressForm.get('address_id')?.setValue(AddressId.value);
    this.OldAddressForm.get('emirate')?.setValue(emirate.innerHTML);
    this.OldAddressForm.get('area')?.setValue(area.innerHTML);
    this.OldAddressForm.get('areaId')?.setValue(areaId.innerHTML);
    SelectedBtn.removeAttribute("disabled")
  }

  getOldLocation(){
    setTimeout(() => {
      this.isNewLocation = false;
    }, 200);
  }

  getLocationId(id:HTMLInputElement){
    this.SelectedLocationId = Number(id.value);
  }

  getNewLocation(){
    this.isNewLocation = true;
    this.OldAddressForm.reset();
  }

  deleteLocation(){
    this._LocationService.deleteAddress(this.SelectedLocationId).subscribe(res=>{
      this.getAddresses()
    })
  }

  getCities(){
    this.cities = []
    this._LocationService.getEmirates().subscribe( (res:IEmirateResponse)=>{
      res.data.forEach((City:IEmirate) => this.cities.push(City));
      if (this.translate.currentLang == 'ar') {
        this.cities.map( e => {
          e.name = e.name_ar
        })
      }
    })
  }

  getAreas(emirate_id:number){
    this.Areas = [];
    let id: number = this._SharedService.getFormData({
      emirate_id: emirate_id,
    }) as any as number;
    this._LocationService.getAreas(id).subscribe( (res:IAreasResponse)=>{
      res.data.forEach((Area:IArea) => this.Areas.push(Area));
      if (this.translate.currentLang == 'ar') {
        this.Areas.map( a => {
          a.area_en = a.area_ar
        })
      }
    })
  }

  addNewAddress(data:FormGroup) {
    if (data.valid) {
      delete data.value.city_id;
      let AddressData:ICreateAddress = this._SharedService.getFormData(data.value) as any as ICreateAddress
      this._LocationService.createAddress(AddressData).subscribe( (res:IAddressResponse) => {
        this.getAddresses();
      });
    } 
    else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error('جميع المدخلات مطلوبة!', 'فشلت محاولة إنشاء عنوان جديد', { timeOut: 4000 });
      }
      else{
        this._ToastrService.error('All inputs are required!', 'Create new address attempt failed', { timeOut: 4000 });
      }
    }
  }

  onTermsChange(terms:HTMLInputElement){
    if (!terms.checked) {
      terms.setAttribute("data-bs-target", "#TermsModal");
    }
    else{
      terms.removeAttribute("data-bs-target");
    }
  }

  getCheckOut_WithAuth(){
    if (this.OldAddressForm.valid) {
      if (this.plan_name == 'custom') {
        const SubData:ICustomCheckOut_WithAuth = {
            subscription_days: this.SubscribtionData.sub_days,
            program_id:this.SubscribtionData.program_id,
            delivery_days:this.SubscribtionData.delivery_days,
            start_date:this.SubscribtionData.start_date,
            price:this.ProgramPrices.price,
            total_price:this.ProgramPrices.grand_total,
            address_id: this.OldAddressForm.controls.address_id?.value,
            subscription_from:"web",
            meal_count:this.SubscribtionData.meal_count,
            snack_count:this.SubscribtionData.snack_count.length,
        }
        this._CheckoutService.getCustomCheckOut_WithAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
      else{
        const SubData:INormalCheckOut_WithAuth = {
          subscription_days: this.SubscribtionData.subscription_days,
          program_id:this.SubscribtionData.program_id,
          meal_count:this.SubscribtionData.meal_types.length,
          delivery_days:this.SubscribtionData.delivery_days,
          start_date:this.SubscribtionData.start_date,
          price:this.ProgramPrices.price,
          total_price:this.ProgramPrices.grand_total,
          address_id: this.OldAddressForm.controls.address_id?.value,
          area_id: this.OldAddressForm.controls.areaId?.value,
          subscription_from:"web",
          meal_backend_types:this.SubscribtionData.meal_types.filter((item:ISubscriptionData_NormalPlan) => !this.SubscribtionData.SnacksType.includes(item)),
          snack_backend_types:this.SubscribtionData.SnacksType
        }
        this._CheckoutService.getNormalCheckOut_WithAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
    }
    else if (this.AddressForm2.valid){
      if (this.plan_name == 'custom') {
        const SubData:ICustomCheckOut_WithAuth = {
            subscription_days: this.SubscribtionData.sub_days,
            program_id:this.SubscribtionData.program_id,
            delivery_days:this.SubscribtionData.delivery_days,
            start_date:this.SubscribtionData.start_date,
            price:this.ProgramPrices.price,
            total_price:this.ProgramPrices.grand_total,
            area_id: this.AddressForm2.controls.area_id?.value,
            address: this.AddressForm2.controls.address?.value,
            subscription_from:"web",
            meal_count:this.SubscribtionData.meal_count,
            snack_count:this.SubscribtionData.snack_count.length,
        }
        this._CheckoutService.getCustomCheckOut_WithAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
      else{
        const SubData:INormalCheckOut_WithAuth = {
          subscription_days: this.SubscribtionData.subscription_days,
          program_id:this.SubscribtionData.program_id,
          meal_count:this.SubscribtionData.meal_types.length,
          delivery_days:this.SubscribtionData.delivery_days,
          start_date:this.SubscribtionData.start_date,
          price:this.ProgramPrices.price,
          total_price:this.ProgramPrices.grand_total,
          area_id: this.AddressForm2.controls.area_id?.value,
          address: this.AddressForm2.controls.address?.value,
          subscription_from:"web",
          meal_backend_types:this.SubscribtionData.meal_types.filter((item:ISubscriptionData_NormalPlan) => !this.SubscribtionData.SnacksType.includes(item)),
          snack_backend_types:this.SubscribtionData.SnacksType
        }
        this._CheckoutService.getNormalCheckOut_WithAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
    }
    else {
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.error('فشلت محاولة الدفع', 'تنبيه', { timeOut: 4000 });
      }
      else{
        this._ToastrService.error('CheckOut attempt failed', 'Notification', { timeOut: 4000 });
      }
    }
  }

  getCheckOut_WithOutAuth(NewAddressForm:FormGroup){
    if (NewAddressForm.valid) {
      if (this.plan_name == 'custom') {
        const SubData:ICustomCheckOut = {
          subscription_days : this.SubscribtionData.sub_days,
          program_id:this.SubscribtionData.program_id,
          meal_count:this.SubscribtionData.meal_count,
          snack_count:this.SubscribtionData.snack_count,
          delivery_days:this.SubscribtionData.delivery_days,
          start_date:this.SubscribtionData.start_date,
          price:this.ProgramPrices.price,
          total_price:this.ProgramPrices.grand_total,
          name : NewAddressForm.controls.name?.value,
          email :NewAddressForm.controls.email?.value,
          mobile:NewAddressForm.controls.mobile?.value,
          area_id:NewAddressForm.controls.area_id?.value,
          address:NewAddressForm.controls.address?.value,
          landline:NewAddressForm.controls.landline?.value,
          subscription_from:"web"
        }
        this._CheckoutService.getCustomCheckOut_WithOutAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
      else{
        const SubData:INormalCheckOut = {
          subscription_days : this.SubscribtionData.subscription_days,
          program_id:this.SubscribtionData.program_id,
          meal_backend_types:this.SubscribtionData.meal_types.filter((item:ISubscriptionData_NormalPlan) => !this.SubscribtionData.SnacksType.includes(item)),
          snack_backend_types:this.SubscribtionData.SnacksType,
          delivery_days:this.SubscribtionData.delivery_days,
          start_date:this.SubscribtionData.start_date,
          price:this.ProgramPrices.price,
          total_price:this.ProgramPrices.grand_total,
          name : NewAddressForm.controls.name?.value,
          email :NewAddressForm.controls.email?.value,
          mobile:NewAddressForm.controls.mobile?.value,
          area_id:NewAddressForm.controls.area_id?.value,
          address:NewAddressForm.controls.address?.value,
          landline:NewAddressForm.controls.landline?.value,
          meal_count:this.SubscribtionData.meal_types.length,
          subscription_from:"web"
        }
        this._CheckoutService.getNormalCheckOut_WithOutAuth(SubData).subscribe((res:IDefaultResponse) => {
          window.location.href = res.data;
        });
      }
    }
  }

  terms:ITerms[] = [];
  getTerms(){
    this._TermsService.getTerms().subscribe(res=>{
      this.terms = res.data
      if (this.translate.currentLang == 'ar') {
        for (let i = 0; i < this.terms.length; i++) {
          this.terms[i].description = this.terms[i].description_ar
          this.terms[i].header = this.terms[i].header_ar
        }
      }
    })
  }
}