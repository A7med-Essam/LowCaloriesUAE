import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import {
  CustomPlan_Menu_CustomOptions2,
  CustomPlan_step4_Dates_CustomOptions,
  Plan_Categories_CustomOptions,
} from 'src/app/shared/models/ngx-owlcarousel';
import {
  faCalendarAlt,
  faEdit,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import {
  ICardsOfDates,
  ICategories,
  IMealDetails,
  IMealDetailsUnique,
  ISubscribtionDetails,
} from 'src/app/shared/interfaces/customPlan';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit {
  DatesOptions: OwlOptions = CustomPlan_step4_Dates_CustomOptions;
  MenuOptions: OwlOptions = CustomPlan_Menu_CustomOptions2;
  faCalendarAlt = faCalendarAlt;
  faArrowsRotate = faArrowsRotate;
  faEdit = faEdit;
  @Input() ClientMeals!: IMealDetailsUnique[];
  @Input() SubscribtionDetailsData!: ISubscribtionDetails;
  @Input() Cards!: ICardsOfDates[];
  @Input() cat!: ICategories[];
  MealsPerDay: number = 0;
  CurrentIndex: number = 0;
  MealDetails!: IMealDetailsUnique;
  DetailsModal: boolean = false;
  EditModal: boolean = false;
  category_index: number = 0;

  constructor(
    private _SharedService: SharedService,
    private _LocalService: LocalService,
    public translate: TranslateService
  ) {
    if (this.translate.currentLang == 'ar') {
      CustomPlan_step4_Dates_CustomOptions.rtl = true;
      CustomPlan_Menu_CustomOptions2.rtl = true;
    } else {
      CustomPlan_step4_Dates_CustomOptions.rtl = false;
      CustomPlan_Menu_CustomOptions2.rtl = false;
    }
  }

  toggleDates(e: HTMLElement) {
    e.classList.add('active');
    const Siblings = this._SharedService.getAllSiblings(
      e.parentElement?.parentElement,
      e.parentElement?.parentElement?.parentElement
    );
    Siblings.forEach((e: HTMLElement) => {
      e.children[0]?.children[0]?.classList.remove('active');
    });
  }

  ngOnInit(): void {
    this._LocalService.setJsonValue('ClientMeals', this.ClientMeals);
    this.MealsPerDay =
      Number(this.SubscribtionDetailsData?.meal_count) +
      Number(this.SubscribtionDetailsData?.snack_count);
    this.getMeals();
    this.getCards();
    if (this.translate.currentLang == 'ar') {
      this.cat.map((c) => (c.name = c.name_ar));
      for (let i = 0; i < this.ClientMeals.length; i++) {
        this.ClientMeals[i].name = this.ClientMeals[i].name_ar;
        this.ClientMeals[i].description = this.ClientMeals[i].description_ar;
      }
    }
  }

  getCards() {
    this.translate.currentLang == 'ar'
      ? this.Cards.map((c) => (c.day = c.day_ar))
      : false;
    this._LocalService.setJsonValue('SubscriptionDates', this.Cards);
  }

  ChangeCurrentIndex(e: number) {
    this.CurrentIndex =
      (Number(this.SubscribtionDetailsData?.meal_count) +
        Number(this.SubscribtionDetailsData?.snack_count)) *
      e;
    this.MealsPerDay =
      this.CurrentIndex +
      (Number(this.SubscribtionDetailsData?.meal_count) +
        Number(this.SubscribtionDetailsData?.snack_count));
  }

  countUp(e: HTMLInputElement, counter: number) {
    if (Number(e.value) < Number(e.max)) {
      let int = parseInt(e.value) + counter;
      e.value = int.toString();
    }
  }

  countDown(e: HTMLInputElement, counter: number) {
    if (Number(e.value) > Number(e.min)) {
      let int = parseInt(e.value) - counter;
      e.value = int.toString();
    }
  }

  editNutrations(
    meal: IMealDetailsUnique,
    main_dish_counter: HTMLInputElement,
    side_dish_counter: HTMLInputElement
  ) {
    if (main_dish_counter.getAttribute('haveside') == 'true') {
      meal.calories =
        (Number(meal.main_dish.calories) * Number(main_dish_counter.value)) /
          Number(meal.main_dish.max) +
        (Number(meal.side_dish.calories) * Number(side_dish_counter.value)) /
          Number(meal.side_dish.max);
      meal.protein =
        (Number(meal.main_dish.protein) * Number(main_dish_counter.value)) /
          Number(meal.main_dish.max) +
        (Number(meal.side_dish.protein) * Number(side_dish_counter.value)) /
          Number(meal.side_dish.max);
      meal.carb =
        (Number(meal.main_dish.carb) * Number(main_dish_counter.value)) /
          Number(meal.main_dish.max) +
        (Number(meal.side_dish.carb) * Number(side_dish_counter.value)) /
          Number(meal.side_dish.max);
      meal.fat =
        (Number(meal.main_dish.fat) * Number(main_dish_counter.value)) /
          Number(meal.main_dish.max) +
        (Number(meal.side_dish.fat) * Number(side_dish_counter.value)) /
          Number(meal.side_dish.max);

      meal.main_dish.user_max = Number(main_dish_counter.value);
      meal.side_dish.user_max = Number(side_dish_counter.value);
    } else {
      meal.calories =
        (Number(meal.main_dish.calories) * Number(main_dish_counter.value)) /
        Number(meal.main_dish.max);
      meal.protein =
        (Number(meal.main_dish.protein) * Number(main_dish_counter.value)) /
        Number(meal.main_dish.max);
      meal.carb =
        (Number(meal.main_dish.carb) * Number(main_dish_counter.value)) /
        Number(meal.main_dish.max);
      meal.fat =
        (Number(meal.main_dish.fat) * Number(main_dish_counter.value)) /
        Number(meal.main_dish.max);
      meal.main_dish.user_max = Number(main_dish_counter.value);
    }
  }

  OpenDetailsModal(m: IMealDetailsUnique) {
    this.DetailsModal = true;
    let meal = this.ClientMeals.find((x) => x.UniqueId == m.UniqueId);
    if (meal) {
      this.MealDetails = meal;
      if (this.translate.currentLang == 'ar') {
        this.MealDetails.name = this.MealDetails.name_ar;
        this.MealDetails.description = this.MealDetails.description_ar;
      }
    }
  }

  OpenEditModal(m: IMealDetailsUnique) {
    this._LocalService.setJsonValue('ClientMeals', this.ClientMeals);
    this.EditModal = true;
    let meal = this.ClientMeals.find((x) => x.UniqueId == m.UniqueId);
    if (meal) {
      this.MealDetails = meal;
      if (this.translate.currentLang == 'ar') {
        this.MealDetails.name = this.MealDetails.name_ar;
        this.MealDetails.description = this.MealDetails.description_ar;
        this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar;
        if (this.MealDetails.side_dish) {
          this.MealDetails.side_dish.item = this.MealDetails.side_dish.item_ar;
        }
      }
    }
  }

  OnCloseModal() {
    this.ClientMeals = this._LocalService.getJsonValue('ClientMeals');
    let m = this.ClientMeals.find(
      (x) => x.UniqueId == this.MealDetails.UniqueId
    );
    if (m) {
      m.calories = this.MealDetails.calories;
      m.protein = this.MealDetails.protein;
      m.carb = this.MealDetails.carb;
      m.fat = this.MealDetails.fat;
      m.main_dish.user_max = this.MealDetails.main_dish.user_max;
      m.side_dish.user_max = this.MealDetails.side_dish.user_max;
    }
    this._LocalService.setJsonValue('ClientMeals', this.ClientMeals);
  }

  changeMeal_meal: boolean = false;
  changeMeal_snack: boolean = false;
  categoryOptions: OwlOptions = Plan_Categories_CustomOptions;
  Meals: IMealDetails[] = [];
  Snacks: IMealDetails[] = [];
  getMeals() {
    this.Meals = [];
    this.Snacks = [];
    if ((this.cat[this.category_index]?.type).toLowerCase() == 'meal') {
      this.Meals = [...this.cat[this.category_index]?.meals];
      if (this.translate.currentLang == 'ar') {
        this.Meals.map((m) => {
          (m.name = m.name_ar), (m.description = m.description_ar);
        });
      }
    } else {
      this.Snacks = [...this.cat[this.category_index]?.meals];
      if (this.translate.currentLang == 'ar') {
        this.Snacks.map((m) => {
          (m.name = m.name_ar), (m.description = m.description_ar);
        });
      }
    }
  }

  toggleCategories(e: Event, index: number) {
    this.category_index = index;
    this._SharedService.toggleCategories(e);
    this.getMeals();
  }

  refreshCarousel(Carousel: CarouselComponent) {
    setTimeout(() => {
      const anyService = Carousel as any;
      const carouselService: CarouselService = anyService.carouselService;
      carouselService.onResize(window?.innerWidth);
      carouselService.refresh();
      carouselService.update();
    }, 0);
  }

  getSnacks() {
    this.Snacks = [];
    for (let i = 0; i < this.cat.length; i++) {
      if ((this.cat[i]?.type).toLowerCase() == 'snack') {
        this.Snacks = [...this.cat[i]?.meals];
        if (this.translate.currentLang == 'ar') {
          this.Snacks.map((m) => {
            (m.name = m.name_ar), (m.description = m.description_ar);
          });
        }
      }
    }
  }

  CurrentChangedMeal!: IMealDetailsUnique;
  getCurrentChangedMeal(e: IMealDetailsUnique) {
    this.CurrentChangedMeal = e;
  }

  @ViewChild('carousel', { static: false }) carousel!: CarouselComponent;

  changeMeal(Meal: IMealDetailsUnique) {
    let UniqueId: string | undefined = '';
    this.ClientMeals.map((x) => {
      if (x.UniqueId == this.CurrentChangedMeal.UniqueId) {
        UniqueId = x.UniqueId;
        Meal.UniqueId = UniqueId;
        this.removeItem(this.ClientMeals, x, Meal);
      }
    });
    if (this.translate.currentLang == 'ar') {
      for (let i = 0; i < this.ClientMeals.length; i++) {
        this.ClientMeals[i].name = this.ClientMeals[i].name_ar;
        this.ClientMeals[i].description = this.ClientMeals[i].description_ar;
      }
    }
    this.refreshCarousel(this.carousel);
  }

  removeItem(
    arr: IMealDetailsUnique[],
    value: IMealDetailsUnique,
    newItem: IMealDetailsUnique
  ) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1, newItem);
    }
    return arr;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: Event) {
    return false;
  }
}
