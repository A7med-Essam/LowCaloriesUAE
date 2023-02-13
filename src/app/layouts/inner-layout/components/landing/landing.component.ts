import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private _SharedService: SharedService) { }

  ngOnInit(): void {
  }

  hover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

  unhover(element:HTMLElement, src:string) {
    this._SharedService.hover(element, src)
  }

}
