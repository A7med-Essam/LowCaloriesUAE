import { Component, Input, OnInit } from '@angular/core';
import { IPlanWeeks } from 'src/app/shared/interfaces/calendar';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss']
})
export class WeeksComponent implements OnInit{
  @Input() planWeeks:IPlanWeeks[][] = [];
  currentWeek:number = 1;
  constructor(
    private _SharedService:SharedService
  ) { }

  ngOnInit(): void {}

  toggleWeeks(e:HTMLElement){
    e.children[0].classList.add('active');
    const Siblings = this._SharedService.getAllSiblings(e, e.parentElement);
      Siblings.forEach((e:HTMLElement) => {
        e.children[0]?.classList.remove("active");
      });
  }
  
}
