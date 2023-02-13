import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICustom_detail } from 'src/app/shared/interfaces/customPlan';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  @Output() countChanged1: EventEmitter<HTMLInputElement> =   new EventEmitter();
  @Output() countChanged2: EventEmitter<HTMLInputElement> =   new EventEmitter();
  @Input() custom_detail!: ICustom_detail[];
  max_meals!:ICustom_detail;
  min_meals!:ICustom_detail;
  max_snacks!:ICustom_detail;
  min_snacks!:ICustom_detail;

  constructor( ) {  }

  ngOnInit(): void {  
    this.getMax_MinDetails(this.custom_detail);
  }

  getMax_MinDetails(array:ICustom_detail[]){
    array.forEach((e:ICustom_detail) => {
      switch (e.property) {
        case "max_meals":
          this.max_meals = e;
          break;
        case "min_meals":
          this.min_meals = e;
          break;
        case "max_snacks":
          this.max_snacks = e;
          break;
        case "min_snacks":
          this.min_snacks = e;
          break;
      }
    });
  }

  countUp(e:HTMLInputElement){
    if (e.value < e.max) {
      let int = parseInt(e.value)+1;
      e.value = int.toString();
    }
    if (e.classList.contains("meals")) {
      this.countChanged1.emit(e);
    }
    else{
      this.countChanged2.emit(e);
    }
  }

  countDown(e:HTMLInputElement){
    let int = parseInt(e.value)-1;
    e.value = int.toString();
    if (parseInt(e.value) < parseInt(e.min)) {
      e.value = "0";
    }
    if (e.classList.contains("meals")) {
      this.countChanged1.emit(e);
    }
    else{
      this.countChanged2.emit(e);
    }
  }

}