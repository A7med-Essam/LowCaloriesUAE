import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import { IPlanDetails } from 'src/app/shared/interfaces/calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  // faChevronRight = faChevronRight;
  // faChevronLeft = faChevronLeft;
  @Output() getDetails: EventEmitter<boolean> = new EventEmitter(false);
  @Output() DayDetails: EventEmitter<string> = new EventEmitter(false);
  @Input() planDetails!:any;
  constructor(

  ) { }

  ngOnInit(): void {
  }

  getDetailsComponent(){
    this.getDetails.emit(true);
  }

  getDayDetails(id:string){
    this.DayDetails.emit(id)
  }

}
