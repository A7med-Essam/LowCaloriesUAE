import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IMenuResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ICart, IMealDetails, IMenu } from 'src/app/shared/interfaces/menu';
import { Menu_Categories_CustomOptions } from 'src/app/shared/models/ngx-owlcarousel';
import { LocalService } from 'src/app/shared/services/local.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  Categories_customOptions: OwlOptions = Menu_Categories_CustomOptions;
  ProgramMeals: IMenu[] = [];
  category_index: number = 0;
  mobileMode: boolean = false;
  menuItemModal: boolean = false;
  innerWidth!: number;
  currentMeal!: IMealDetails;

  constructor(
    private _SharedService: SharedService,
    private _MenuService: MenuService,
    private _ToastrService: ToastrService,
    private _I18nService: I18nService,
    private _LocalService: LocalService,
    private _Router: Router,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate);
  }

  isLoggedIn: boolean = false;
  ngOnInit(): void {
    if (this._LocalService.getJsonValue('userInfo') != null) {
      this.isLoggedIn = true;
    } else {
      this.cart_WithoutAuth = this.getShoppingCartWithoutAuth();
    }

    this.detectingRealTimeWindowSize();
    this.getMeals();
    if (this.translate.currentLang == 'ar') {
      Menu_Categories_CustomOptions.rtl = true;
    } else {
      Menu_Categories_CustomOptions.rtl = false;
    }
  }

  getMealDetails(meal: IMealDetails) {
    this.menuItemModal = true;
    this.currentMeal = meal;
  }

  detectingRealTimeWindowSize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 769) {
      this.mobileMode = true;
    } else {
      this.mobileMode = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.detectingRealTimeWindowSize();
  }

  toggleCategories(e: Event, index: number) {
    this.category_index = index;
    this._SharedService.toggleCategories(e);
  }

  getMeals() {
    this._MenuService.getMenu().subscribe((res: IMenuResponse) => {
      this.ProgramMeals = [...res.data];
      if (this.translate.currentLang == 'ar') {
        this.ProgramMeals.map((p) => {
          p.name = p.name_ar;
          p.meal_details.map((m) => {
            m.item = m.item_ar;
            m.description = m.description_ar;
          });
        });
      }
      this.getShoppingCart();
    });
  }

  // With Auth Shopping Cart
  cart: ICart[] = [];

  getShoppingCart() {
    if (this.isLoggedIn) {
      this._MenuService.getShoppingCart().subscribe({
        next: (res) => {
          this.cart = res.data;
        },
      });
    }
  }

  addToCart(meal: IMealDetails, gram_count?: number) {
    if (!this.cart.find((m: ICart) => m.item_id == meal.id)) {
      const item = this.getShoppingCartItem(meal);
      gram_count ? (item.gram_pcs_count = gram_count) : false;
      this._MenuService.addToShoppingCart(item).subscribe({
        next: (res) => {
          if (res.status == 1) {
            this.getShoppingCart();
          } else {
            this._ToastrService.success(res.message, '', {
              timeOut: 3000,
            });
          }
        },
      });
    } else {
      this.shoppingCart_FailedNotify();
    }
  }

  // Without Auth Shopping Cart
  cart_WithoutAuth: ICart[] = [];

  addToCartWithoutAuth(meal: IMealDetails, gram_count?: number) {
    if (!this.cart_WithoutAuth.find((m: ICart) => m.item_id == meal.id)) {
      const item = this.getShoppingCartItem(meal);
      gram_count ? (item.gram_pcs_count = gram_count) : false;
      this.cart_WithoutAuth.push(item);
      this.saveShoppingCartInSession();
      this.shoppingCart_SuccessNotify();
    } else {
      this.shoppingCart_FailedNotify();
    }
  }

  getShoppingCartWithoutAuth() {
    let cartDetails = sessionStorage.getItem('cartDetails');
    return cartDetails ? JSON.parse(cartDetails) : [];
  }

  saveShoppingCartInSession() {
    sessionStorage.setItem(
      'cartDetails',
      JSON.stringify(this.cart_WithoutAuth)
    );
  }

  // common methods in Shopping Cart
  getShoppingCartItem(meal: IMealDetails) {
    const item: ICart = {
      count: 1,
      total_price: meal.price,
      item_id: meal.id,
      unit: meal.menu_unit,
      gram_pcs_count: meal.menu_unit == 'GM' ? 150 : 1,
    };
    return item;
  }

  shoppingCart_SuccessNotify() {
    if (this.translate.currentLang == 'ar') {
      this._ToastrService.success('تمت إضافة الوجبة بنجاح', 'السلة', {
        timeOut: 3000,
      });
    } else {
      this._ToastrService.success('Meal added successfully', 'Shopping Cart', {
        timeOut: 3000,
      });
    }
  }

  shoppingCart_FailedNotify() {
    if (this.translate.currentLang == 'ar') {
      this._ToastrService.warning('تمت إضافة هذه الوجبة بالفعل', 'السلة', {
        timeOut: 3000,
      });
    } else {
      this._ToastrService.warning(
        'This meal is already added',
        'Shopping Cart',
        { timeOut: 3000 }
      );
    }
  }

  getCartMeals(cateogries: IMenu[], cartItems: ICart[]) {
    let myCart: IMealDetails[] = [];
    cateogries.forEach((cat) => {
      cat.meal_details.forEach((meal: any) => {
        cartItems.forEach((cart) => {
          if (meal.id == cart.item_id) {
            meal.cart_id = cart.id;
            meal.price = cart.total_price;
            meal.count = cart.count;
            cart.gram_pcs_count
              ? (meal.gram_pcs_count = cart.gram_pcs_count)
              : (meal.gram_pcs_count = null);
            myCart.push(meal);
          }
        });
      });
    });
    return myCart;
  }

  goToShoppingCartPage() {
    let shoppingCartItems;
    if (this.isLoggedIn) {
      shoppingCartItems = this.getCartMeals(this.ProgramMeals, this.cart);
    } else {
      shoppingCartItems = this.getCartMeals(
        this.ProgramMeals,
        this.cart_WithoutAuth
      );
    }
    this._MenuService.shoppingCartItems.next(shoppingCartItems);
    this._Router.navigate(['/menu/cart']);
  }

  // ********************
  getMealPrice(meal: IMealDetails, price: number, gram_count: number) {
    let CART_ITEM: IMealDetails = {
      calories: meal.calories,
      carb: meal.carb,
      description: meal.description,
      description_ar: meal.description_ar,
      fat: meal.fat,
      id: meal.id,
      image: meal.image,
      item: meal.item,
      item_ar: meal.item_ar,
      kilj: meal.kilj,
      menu_unit: meal.menu_unit,
      protein: meal.protein,
      unit: meal.unit,
      price: price,
    };
    if (this.isLoggedIn) {
      this.addToCart(CART_ITEM, gram_count);
    } else {
      this.addToCartWithoutAuth(CART_ITEM, gram_count);
    }
  }
}
