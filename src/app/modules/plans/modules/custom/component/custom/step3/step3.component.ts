import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomPlanService } from 'src/app/shared/services/plans/custom-plan.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { ICardsOfDates, ICategories, IMealDetails, IMealDetailsUnique, ISubscribtionDetails } from 'src/app/shared/interfaces/customPlan';
import { CustomPlan_Menu_CustomOptions, Plan_Categories_CustomOptions } from 'src/app/shared/models/ngx-owlcarousel';
import { faCalendarAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { TranslateService } from '@ngx-translate/core';
import { ICardsOfDatesResponse } from 'src/app/shared/interfaces/HttpResponse';
import { ICheckOutPrice } from 'src/app/shared/interfaces/checkout';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit, OnDestroy  {
  categoryOptions:OwlOptions = Plan_Categories_CustomOptions;
  MenuOptions:OwlOptions = CustomPlan_Menu_CustomOptions;
  faCheckCircle = faCheckCircle;
  faCalendarAlt = faCalendarAlt;
  @Output() checkOutPrice: EventEmitter<ICheckOutPrice> = new EventEmitter();
  @Output() Cards: EventEmitter<ICardsOfDates[]> = new EventEmitter();
  @Output() MealsSelected: EventEmitter<boolean> =   new EventEmitter();
  @Output() FinalMeals: EventEmitter<IMealDetailsUnique[]> =   new EventEmitter();
  @Output() categories2: EventEmitter<ICategories[]> =   new EventEmitter();
  @Input() SubscribtionDetailsData!:ISubscribtionDetails;
  categories:ICategories[] = [];
  Meals:IMealDetails[] = [];
  Snacks:IMealDetails[] = [];
  CardsOfDates:ICardsOfDates[] = [];
  ListOfMeals:IMealDetailsUnique[] = [];
  ListOfSnacks:IMealDetailsUnique[] = [];
  category_index:number = 0;
  meal_count!:number;
  snack_count!:number;
  subscription_days!:number;
  UniqueId!:string;
  MealDetails!:IMealDetailsUnique;
  CurrentIcon!:HTMLElement;
  SelectedIcon!:HTMLElement;
  SelectedMealModal:boolean = false;
  RandomSelectionModal_meal:boolean = false;
  RandomSelectionModal_snack:boolean = false;
  isSorted:boolean = false;
  viewMeals:IMealDetailsUnique[] = []
  viewSnacks:IMealDetailsUnique[] = []
  viewSelectedMealsModal:boolean = false;
  toggleFlag_RandomSelectionModal_meal:boolean = true;
  toggleFlag_RandomSelectionModal_snack:boolean = true;
  DetailsModal:boolean = false;

  constructor(
    private _SharedService:SharedService,
    private _CustomPlanService:CustomPlanService,
    private _NgxUiLoaderService: NgxUiLoaderService,
    private _ToastrService:ToastrService,
    private _ElementRef: ElementRef,
    private _LocalService:LocalService,
    private changeDetector : ChangeDetectorRef,
    public translate: TranslateService
  ) {  
    window.onpopstate = function (e) { 
      _LocalService.removeItem("ListOfMeals")
      _LocalService.removeItem("ListOfSnacks")
    }
    if (this.translate.currentLang == 'ar') {
      Plan_Categories_CustomOptions.rtl = true;
      CustomPlan_Menu_CustomOptions.rtl = true;
    }
    else{
      Plan_Categories_CustomOptions.rtl = false;
      CustomPlan_Menu_CustomOptions.rtl = false;
    }
    
  }

  ngOnInit(): void {
    this._NgxUiLoaderService.startLoader('master','1',{
      delay:0
    });
    this.getCategories(this.SubscribtionDetailsData.program_id);
    this.getCardsOfDates(this.SubscribtionDetailsData);
  }

  countUp(e:HTMLInputElement, counter:number){
    if (Number(e.value) < Number(e.max)) {
      let int = parseInt(e.value)+counter;
      e.value = int.toString();
    }
  }

  countDown(e:HTMLInputElement, counter:number){
    if (Number(e.value) > Number(e.min)) {
      let int = parseInt(e.value)-counter;
      e.value = int.toString();
    }
  }

  toggleCategories(e:Event, index:number){
    this.category_index = index;
    this._SharedService.toggleCategories(e);
    this.getMeals();
  }
  
  getCategories(program_id:number){
    let id: number = this._SharedService.getFormData({ program_id: program_id}) as any as number;
    this._CustomPlanService.getCategories_with_meals(id).subscribe(res=>{
      this.categories = [...res.data];
      this.translate.currentLang == 'ar'? this.categories.map( c => c.name = c.name_ar):false;
      this.categories2.emit(this.categories);
      this._LocalService.setJsonValue('categories', this.categories);
      this.getMeals();
      if (this.Meals.length != 0) {
        this._NgxUiLoaderService.stopLoader('master','1');
      }
    })
  }

  getMeals(){
    this.Meals = [];
    this.Snacks = [];

    if ((this.categories[this.category_index]?.type).toLowerCase() == "meal") {
      this.Meals = [...this.categories[this.category_index]?.meals]
      this.translate.currentLang == 'ar'? this.Meals.map( m => { m.name = m.name_ar, m.description = m.description_ar}):false;
    }
    else{
      this.Snacks = [...this.categories[this.category_index]?.meals]
      this.translate.currentLang == 'ar'? this.Snacks.map( m => { m.name = m.name_ar, m.description = m.description_ar}):false;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  getCardsOfDates(SubscribtionDetails:ISubscribtionDetails){
    this._CustomPlanService.getCardsOfDates(SubscribtionDetails).subscribe((res:ICardsOfDatesResponse)=>{
      this.CardsOfDates = [...res.data.card_dates]
      this.translate.currentLang == 'ar'? this.CardsOfDates.map( c => c.day = c.day_ar): false;
      this.Cards.emit([...res.data.card_dates]) 
      this.meal_count = res.data.meal_count
      this.snack_count = res.data.snack_count
      this.subscription_days = res.data.subscription_days
      
      this.checkOutPrice.emit({
        code_apply:res.data.code_apply,
        grand_total:res.data.grand_total,
        price:res.data.price,
        vat:res.data.vat,
        bag_price:res.data.bag_price,
      })
    })
  }

  getJsonMealDetails(id:HTMLInputElement,type:HTMLInputElement){
    let MealDetails!:IMealDetailsUnique;
    let CurrentMeal!:IMealDetails;
    if (type.value.toLowerCase() == 'meal') {
      let found = this.Meals.find(x=>x.id == Number(id.value));
      found? CurrentMeal = found:false
    }
    else{
      let found = this.Snacks.find(x=>x.id == Number(id.value));
      found? CurrentMeal = found:false
    }
    MealDetails = {UniqueId:this.UniqueId,...CurrentMeal}
    return MealDetails;
  }

  pickMeal(id:HTMLInputElement,type:HTMLInputElement, status:boolean = true){
    if ( (this.ListOfMeals.length+this.ListOfSnacks.length) < (this.subscription_days*(this.snack_count+this.meal_count))) {
      this.UniqueId = "meal_" + Math.random().toString(16).slice(2);
      this.MealDetails = this.getJsonMealDetails(id,type);
      if (this.translate.currentLang == 'ar') {
        this.MealDetails.name = this.MealDetails.name_ar 
        this.MealDetails.description = this.MealDetails.description_ar 
        this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar 
        if (this.MealDetails.side_dish) {
          this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
        }
      }
      if (status) {
        this.sortSelection();
      }
      else{
        this.randomSelection();
      }
      this.checkViewSelectedMeals();
      this.addMeal();
      this.checkValidation();
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.info("تم أضافه الوجبة")
      }
      else{
        this._ToastrService.info("Meal added")
      }
    }
    else{
      if (this.translate.currentLang == 'ar') {
        this._ToastrService.warning("خطتك ممتلئة")
      }
      else{
        this._ToastrService.warning("Your plan is full")
      }
    }
  }

  addMeal(){
    this.ListOfMeals = [];
    this.ListOfSnacks = [];
    this.ListOfMeals = this._LocalService.getJsonValue('ListOfMeals')?this._LocalService.getJsonValue('ListOfMeals'):[];
    this.ListOfSnacks = this._LocalService.getJsonValue('ListOfSnacks')?this._LocalService.getJsonValue('ListOfSnacks'):[];
    if ((this.MealDetails.type).toLowerCase() == "meal") {
      if (this.ListOfMeals.length < (this.meal_count*this.subscription_days)) {
        this.ListOfMeals.push(this.MealDetails)
      }
      else{
        if (this.translate.currentLang == 'ar') {
          this._ToastrService.warning("لا يمكنك إضافة أكثر من "+this.meal_count+" وجبات في اليوم")
        }
        else{
          this._ToastrService.warning("You can't add more than "+this.meal_count+" meals per day")
        }
      }
    }
    else{
      if (this.ListOfSnacks.length < (this.snack_count*this.subscription_days)) {
        this.ListOfSnacks.push(this.MealDetails)
      }
      else{
        if (this.translate.currentLang == 'ar') {
          this._ToastrService.warning("لا يمكنك إضافة أكثر من "+this.snack_count+" مقبلات في اليوم")
        }
        else{
          this._ToastrService.warning("You can't add more than "+this.snack_count+" snacks per day")
        }
      }
    }
    this._LocalService.setJsonValue('ListOfMeals', this.ListOfMeals);
    this._LocalService.setJsonValue('ListOfSnacks', this.ListOfSnacks);
  }

  checkValidation(){
    if ((this.ListOfMeals.length+this.ListOfSnacks.length) == this.subscription_days*(this.snack_count+this.meal_count)) {
      this.MealsSelected.emit(true)
      this.FinalMeals.emit(this.getFinalMeals())
    }
    else{
      this.MealsSelected.emit(false)
    }
  }

  sortSelection(){
    if ((this.MealDetails.type).toLowerCase() == "meal") {
      const meals:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.Meal_Icon');
      for (let i = 0; i < meals.length; i++) {
        if (!meals[i].getAttribute("isSelected")) {
          meals[i].setAttribute("src",'../../../../../../../../assets/images/custom-plan/selected.png')
          meals[i].setAttribute("UniqueId",this.UniqueId)
          meals[i].setAttribute("isSelected",'true')
          return
        }
      }
    }
    else{
      const snacks:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.Snack_Icon');
      for (let i = 0; i < snacks.length; i++) {
        if (!snacks[i].getAttribute("isSelected")) {
          snacks[i].setAttribute("src",'../../../../../../../../assets/images/custom-plan/selected.png')
          snacks[i].setAttribute("UniqueId",this.UniqueId)
          snacks[i].setAttribute("isSelected",'true')
          return
        }
      }
    }
  }

  randomSelection(){
    this.CurrentIcon.setAttribute("src",'../../../../../../../../assets/images/custom-plan/selected.png')
    this.CurrentIcon.setAttribute("isSelected",'true')
    this.CurrentIcon.setAttribute("UniqueId",this.UniqueId)
  }

  getSelectedIcon(e:HTMLElement){
    if (!e.hasAttribute("isSelected")) {
      this.CurrentIcon = e;
    }
    else{
      this.SelectedIcon = e;
    }
  }

  OpenMealDetailsModal(e:HTMLElement,type:string){
    this._LocalService.setJsonValue('ListOfMeals', this.ListOfMeals);
    this._LocalService.setJsonValue('ListOfSnacks', this.ListOfSnacks);
    if (e.getAttribute("isSelected")) {
      let UniqueId = e.getAttribute('UniqueId');
      this.SelectedMealModal = true;
      if (type.toLowerCase() == 'meal') {
        let meal = this.ListOfMeals.find(x=>x.UniqueId == UniqueId);
        if (meal) {
          this.MealDetails = meal;
          // this.MealDetails_name = {en:this.MealDetails.name,ar:this.MealDetails.name_ar}
          // this.MealDetails_desc = {en:this.MealDetails.description,ar:this.MealDetails.description_ar}
          // this.MealDetails_mainName = {en:this.MealDetails.main_dish.item,ar:this.MealDetails.main_dish.item_ar}
          // this.MealDetails_sideName = {en:this.MealDetails?.side_dish?.item,ar:this.MealDetails?.side_dish?.item_ar}
          if (this.translate.currentLang == 'ar') {
            this.MealDetails.name = this.MealDetails.name_ar 
            this.MealDetails.description = this.MealDetails.description_ar 
            this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar 
            if (this.MealDetails.side_dish) {
              this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
            }
            // this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
          }
        }
      } 
      else {
        let snack = this.ListOfSnacks.find(x=>x.UniqueId == UniqueId);
        if (snack) {
          this.MealDetails = snack;
          // this.MealDetails_name = {en:this.MealDetails.name,ar:this.MealDetails.name_ar}
          // this.MealDetails_desc = {en:this.MealDetails.description,ar:this.MealDetails.description_ar}
          // this.MealDetails_mainName = {en:this.MealDetails.main_dish.item,ar:this.MealDetails.main_dish.item_ar}
          // this.MealDetails_sideName = {en:this.MealDetails?.side_dish?.item,ar:this.MealDetails?.side_dish?.item_ar}
          if (this.translate.currentLang == 'ar') {
            this.MealDetails.name = this.MealDetails.name_ar 
            this.MealDetails.description = this.MealDetails.description_ar 
            this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar 
            if (this.MealDetails.side_dish) {
              this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
            }
            // this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
          }
        }
      }
    }
  }

  deleteMeal(meal_id:string|undefined,type:string|undefined){
    if (meal_id) {
      this.SelectedIcon.setAttribute("src",'../../../../../../../../assets/images/custom-plan/choose.png');
      this.SelectedIcon.removeAttribute("isSelected");
      if (type?.toLowerCase() == "meal") {
        this.ListOfMeals = [...this.ListOfMeals.filter(m=>m.UniqueId != meal_id)];
      }
      else{
        this.ListOfSnacks = [...this.ListOfSnacks.filter(m=>m.UniqueId != meal_id)];
      }
      this.checkViewSelectedMealsOnDelete();
      this.checkValidation();
      this._LocalService.setJsonValue('ListOfMeals', this.ListOfMeals);
      this._LocalService.setJsonValue('ListOfSnacks', this.ListOfSnacks);
    }
  }

  @ViewChild('carousel1', { static: false }) carousel1!: CarouselComponent;
  @ViewChild('carousel2', { static: false }) carousel2!: CarouselComponent;
  @ViewChild('carousel3', { static: false }) carousel3!: CarouselComponent;
  @ViewChild('carousel4', { static: false }) carousel4!: CarouselComponent;
  
  openRandomSelectionModal(e:HTMLElement,type:string){
    if (e && !e?.getAttribute("isSelected")) {
      if(type.toLowerCase() == "meal"){
        this.RandomSelectionModal_meal = true;
        this.refreshCarousel(this.carousel1);
        this.refreshCarousel(this.carousel2);
      }
      else{
        this.RandomSelectionModal_snack = true;
        this.refreshCarousel(this.carousel3);
        this.refreshCarousel(this.carousel4);
      }
    }
  }

  refreshCarousel(Carousel:CarouselComponent){
    setTimeout(() => {
      if (Carousel) {
        const anyService = Carousel as any;
        const carouselService:CarouselService = anyService.carouselService;
          carouselService.onResize(window?.innerWidth);
          carouselService.refresh();
          carouselService.update();
      }
    }, 0);
  }

  close_RandomSelectionModal_meal(){
    this.toggleFlag_RandomSelectionModal_meal = false;
    setTimeout(() => {
      this.toggleFlag_RandomSelectionModal_meal = true;
    }, 1);
  }

  close_RandomSelectionModal_snack(){
    this.toggleFlag_RandomSelectionModal_snack = false;
    setTimeout(() => {
      this.toggleFlag_RandomSelectionModal_snack = true;
    }, 1);
  }

  show_RandomSelectionModal_snack(){
    this.Snacks = [];
    for (let i = 0; i < this.categories.length; i++) {
      if ((this.categories[i]?.type).toLowerCase() == "snack") {
        this.Snacks = [...this.categories[i]?.meals]
        if (this.translate.currentLang == 'ar') {
          this.Snacks.map( s => {
            s.description = s.description_ar
            s.name = s.name_ar
          })
        }
      }  
    }
    this.refreshCarousel(this.carousel4);
  }

  getDetails(id:HTMLInputElement, type:HTMLInputElement){
    this.DetailsModal = true;
    if (type.value.toLowerCase() == 'meal') {
      let meal = this.Meals.find(x=>x.id == Number(id?.value));
      if (meal) {
        this.MealDetails = meal;
        if (this.translate.currentLang == 'ar') {
          this.MealDetails.name = this.MealDetails.name_ar 
          this.MealDetails.description = this.MealDetails.description_ar 
          this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar 
          if (this.MealDetails.side_dish) {
            this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
          }
        }
      }
    } 
    else {
      let snack = this.Snacks.find(x=>x.id == Number(id?.value));
      if (snack) {
        this.MealDetails = snack;
        if (this.translate.currentLang == 'ar') {
          this.MealDetails.name = this.MealDetails.name_ar 
          this.MealDetails.description = this.MealDetails.description_ar 
          this.MealDetails.main_dish.item = this.MealDetails.main_dish.item_ar 
          if (this.MealDetails.side_dish) {
            this.MealDetails.side_dish.item = this.MealDetails?.side_dish?.item_ar 
          }
        }
      }
    }
  }

  getFinalMeals(){
    const card:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.day-card');
    let meals_id:string[] = [];
    card.forEach(meal=>{
      let mealId:NodeListOf<HTMLImageElement> = meal.querySelectorAll('img');
      for (let i = 0; i < mealId.length; i++) {
        let id = mealId[i].getAttribute("uniqueid")
        if (id) {
          meals_id.push(id);
        }
      }
    })
    let finalMeals:IMealDetailsUnique[] = [];
    let List_Of_Meals_And_Snacks:IMealDetailsUnique[] = this.ListOfMeals.concat(this.ListOfSnacks);

    meals_id.forEach(id=>{
      let meal = List_Of_Meals_And_Snacks.find(meal=>{ return meal.UniqueId == id })
      if (meal) {
        finalMeals.push(meal)
      }
    })
    return finalMeals
  }

  checkViewSelectedMeals(){
    const card:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.day-card');
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < this.meal_count; j++) {
        if (card[i]?.children[0]?.children[1]?.children[1]?.children[j]?.hasAttribute("isSelected") || card[i]?.children[0]?.children[2]?.children[1]?.children[j]?.hasAttribute("isSelected")) {
          if (this.snack_count == 0) {
            card[i]?.children[0]?.children[2].classList.remove('text-muted')
            card[i]?.children[0]?.children[2].classList.add('txt-main')
          }
          else{
            card[i]?.children[0]?.children[3].classList.remove('text-muted')
            card[i]?.children[0]?.children[3].classList.add('txt-main')
          }
        }
      }
    }
  }

  checkViewSelectedMealsOnDelete(){
    const card_number = Number(this.SelectedIcon?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute("card"));
    const card:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.day-card');
    if (this.snack_count == 0) {
      for (let i = 0; i < this.meal_count; i++) {
        if (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.hasAttribute("isSelected") ){
            card[card_number]?.children[0]?.children[2].classList.remove('text-muted')
            card[card_number]?.children[0]?.children[2].classList.add('txt-main')
            return
        }
        else{
          card[card_number]?.children[0]?.children[2].classList.remove('txt-main')
          card[card_number]?.children[0]?.children[2].classList.add('text-muted')
          return
        }
      }
    }
    else{
      for (let i = 0; i < this.meal_count; i++) {
        for (let j = 0; j < this.snack_count; j++) {
          if (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.hasAttribute("isSelected") 
              || card[card_number]?.children[0]?.children[2]?.children[1]?.children[j]?.hasAttribute("isSelected")){
            card[card_number]?.children[0]?.children[3].classList.remove('text-muted')
            card[card_number]?.children[0]?.children[3].classList.add('txt-main')
            return
          }
          else{
            card[card_number]?.children[0]?.children[3].classList.remove('txt-main')
            card[card_number]?.children[0]?.children[3].classList.add('text-muted')
            return
          }
        }
      }
    }
  }

  carousel5!: CarouselComponent;
  @ViewChild('carousel5', { static: false }) set ft0(carousel5: CarouselComponent) {
    this.carousel5 = carousel5;
  }
  carousel6!: CarouselComponent;
  @ViewChild('carousel6', { static: false }) set ft1(carousel6: CarouselComponent) {
    this.carousel6 = carousel6;
  }
  viewMealsPerCard(e:HTMLElement, viewSelectedMeals:HTMLElement){
    this.viewMeals = [];
    this.viewSnacks = [];
    if (viewSelectedMeals.classList.contains('txt-main')) {
      const card_number = Number(e?.getAttribute("card"));
      const card:HTMLElement[] = this._ElementRef.nativeElement.querySelectorAll('.day-card');
  
      if (this.snack_count == 0) {
        for (let i = 0; i < this.meal_count; i++) {
          if (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.hasAttribute("isSelected") ){
            let meal_id:string|undefined = (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.getAttribute("uniqueid"))?.toString();
            this.ListOfMeals.forEach(m=>{
              if (m.UniqueId == meal_id) {
                this.viewMeals.push(m);
                this.translate.currentLang == 'ar'? this.viewMeals.map( v => {
                  v.name = v.name_ar,
                  v.description = v.description_ar
                }):false;
              }
            })
          }
        }
      }
      else{
        for (let i = 0; i < this.meal_count; i++) {
          if (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.hasAttribute("isSelected")){
            let meal_id:string | undefined = (card[card_number]?.children[0]?.children[1]?.children[1]?.children[i]?.getAttribute("uniqueid"))?.toString();
            this.ListOfMeals.forEach(m=>{
              if (m.UniqueId == meal_id) {
                this.viewMeals.push(m);
                this.translate.currentLang == 'ar'? this.viewMeals.map( v => {
                  v.name = v.name_ar,
                  v.description = v.description_ar
                }):false;
              }
            })
          }
        }
        for (let j = 0; j < this.snack_count; j++) {
          if (card[card_number]?.children[0]?.children[2]?.children[1]?.children[j]?.hasAttribute("isSelected")){
            let snack_id:string | undefined = (card[card_number]?.children[0]?.children[2]?.children[1]?.children[j]?.getAttribute("uniqueid"))?.toString();
            this.ListOfSnacks.forEach(m=>{
              if (m.UniqueId == snack_id) {
                this.viewSnacks.push(m);
                this.translate.currentLang == 'ar'? this.viewMeals.map( v => {
                  v.name = v.name_ar,
                  v.description = v.description_ar
                }):false;
              }
            })
          }
        }
      }
    }
    this.displayViewSelectedMealsModal()
    this.changeDetector.detectChanges();
    this.refreshCarousel(this.carousel5);
    this.refreshCarousel(this.carousel6);
  }

  displayViewSelectedMealsModal(){
    if (this.viewMeals.length == 0 && this.viewSnacks.length == 0) {
      this.viewSelectedMealsModal=false;
    }
    else{
      this.viewSelectedMealsModal=true;
    }
  }

  editNutrations(meal:IMealDetailsUnique, main_dish_counter:HTMLInputElement, side_dish_counter:HTMLInputElement){
    if (main_dish_counter.getAttribute("haveside") == 'true') {
      meal.calories = ((Number(meal.main_dish.calories) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max)) +
       (Number(meal.side_dish.calories) * (Number(side_dish_counter.value)) / Number(meal.side_dish.max)))
      meal.protein = ((Number(meal.main_dish.protein) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max)) + 
       (Number(meal.side_dish.protein) * (Number(side_dish_counter.value)) / Number(meal.side_dish.max)))
      meal.carb = ((Number(meal.main_dish.carb) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max)) + 
       (Number(meal.side_dish.carb) * (Number(side_dish_counter.value)) / Number(meal.side_dish.max)))
      meal.fat = ((Number(meal.main_dish.fat) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max)) + 
       (Number(meal.side_dish.fat) * (Number(side_dish_counter.value)) / Number(meal.side_dish.max)))

      meal.main_dish.user_max = Number(main_dish_counter.value);
      meal.side_dish.user_max = Number(side_dish_counter.value);
    }
    else{
      meal.calories = (Number(meal.main_dish.calories) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max));
      meal.protein = (Number(meal.main_dish.protein) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max));
      meal.carb = (Number(meal.main_dish.carb) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max));
      meal.fat = (Number(meal.main_dish.fat) * (Number(main_dish_counter.value)) / Number(meal.main_dish.max));
      meal.main_dish.user_max = Number(main_dish_counter.value);
    }


  }

  DetailsModal_ViewSelectedMeals:boolean = false;
  getDetails_ViewSelectedMeal(id:HTMLInputElement, type:HTMLInputElement){
    this.DetailsModal_ViewSelectedMeals = true;
    if (type.value.toLowerCase() == 'meal') {
      let meal = this.ListOfMeals.find(x=>x.UniqueId == id?.value);
      if (meal) {
        this.MealDetails = meal;
        if (this.translate.currentLang == 'ar') {
          this.MealDetails.name = this.MealDetails.name_ar 
          this.MealDetails.description = this.MealDetails.description_ar 
        }
      }
    } 
    else {
      let snack = this.ListOfSnacks.find(x=>x.UniqueId == id?.value);
      if (snack) {
        this.MealDetails = snack;
        if (this.translate.currentLang == 'ar') {
          this.MealDetails.name = this.MealDetails.name_ar 
          this.MealDetails.description = this.MealDetails.description_ar 
        }
      }
    }
  }

  onCloseModal(meal:IMealDetailsUnique){
    this.upDateList(meal)
    let cat = this._LocalService.getJsonValue('categories')
    if (cat) {
      this.categories = cat;
      this.getMeals()
      window.scrollTo(0, 0);
    }
    this.refreshCarousel(this.carousel1);
    this.refreshCarousel(this.carousel2);
    this.refreshCarousel(this.carousel3);
    this.refreshCarousel(this.carousel4);
  }

  upDateList(meal:IMealDetailsUnique){
    if (meal.type.toLowerCase() == 'meal') {
      this.ListOfMeals = this._LocalService.getJsonValue('ListOfMeals');
      this.ListOfMeals.map(x=>{
      if (x.UniqueId == meal.UniqueId) {
          x.calories = meal.calories;
          x.protein = meal.protein;
          x.carb = meal.carb;
          x.fat = meal.fat;
          x.main_dish.user_max = meal?.main_dish.user_max
          if (x.side_dish) {
            x.side_dish.user_max = meal?.side_dish.user_max
          }
        }
      })
      this._LocalService.setJsonValue('ListOfMeals', this.ListOfMeals);
    }
    else{
      this.ListOfSnacks = this._LocalService.getJsonValue('ListOfSnacks');
      this.ListOfSnacks.map(x=>{
        if (x.UniqueId == meal.UniqueId) {
          x.calories = meal.calories;
          x.protein = meal.protein;
          x.carb = meal.carb;
          x.fat = meal.fat;
          x.main_dish.user_max = meal?.main_dish.user_max
          if (x.side_dish) {
            x.side_dish.user_max = meal?.side_dish.user_max
          }
        }
      })
      this._LocalService.setJsonValue('ListOfSnacks', this.ListOfSnacks);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event:Event) {
    this._LocalService.removeItem("ListOfMeals")
    this._LocalService.removeItem("ListOfSnacks")
    return false;
  }

  ngOnDestroy(): void {
    this._LocalService.removeItem("ListOfMeals")
    this._LocalService.removeItem("ListOfSnacks")
  }
}