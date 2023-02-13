import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IClinic, IWhatsAppMsg } from 'src/app/shared/interfaces/clinic';
import { ClinicService } from 'src/app/shared/services/clinic/clinic.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { IClinicCheckOutSubInfo } from 'src/app/shared/interfaces/checkout';
import { IClinicDatesResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IOnlineAppointments } from 'src/app/shared/interfaces/clinic';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  today:Date = new Date();
  @Input() Emirate_appointments!: IClinic[];
  @Input() ClinicForm!: FormGroup;
  minDate:Date = new Date();
  maxDate:Date = new Date();
  invalidDates:Date[] = [];
  isSelectedDate:boolean = false;
  SelectedAppointment:IOnlineAppointments[] = [];
  price:number = 0;
  @Output() isSelectedTime: EventEmitter<boolean> = new EventEmitter();
  @Output() SubInfo: EventEmitter<IClinicCheckOutSubInfo> = new EventEmitter();
  faClinicMedical = faTruckFast;
  mobile:string = "971505025430"
  msg!:IWhatsAppMsg;
  @ViewChild ('people_count') people_count!:ElementRef<HTMLInputElement>;
  max_people:string = '1';

  constructor(
    private _SharedService:SharedService,
    private _ClinicService:ClinicService
  ) { }

  ngOnInit(): void { 
    let Dates:string[] = [];
    this.Emirate_appointments[0]?.online_appointments.forEach(date => {
      Dates.push(date.date)
    });
    this.getDates(Dates);
    this.price = Number(this.Emirate_appointments[0].inbody_price);
  }

  toggleAppointments(e:Event){
    let el = e.target as Element;
    el.classList.add("active");
    const Siblings = this._SharedService.getAllSiblings(el.parentElement, el.parentElement?.parentElement);
    Siblings.forEach((e:HTMLElement) => {
      e.children[0].classList.remove("active");
    });
  }

  countUp(e:HTMLInputElement){
    if (e.value < e.max) {
      let int = parseInt(e.value)+1;
      e.value = int.toString();
    }
    this.getPrice(Number(e.value))
  }

  countDown(e:HTMLInputElement){
    let int = parseInt(e.value)-1;
    e.value = int.toString();
    if (parseInt(e.value) <= parseInt(e.min)) {
      e.value = e.min
    }
    this.getPrice(Number(e.value))
  }

  // times:any;
  getDates(dates:string[]){
    this._ClinicService.getDates(dates).subscribe((res:IClinicDatesResponse)=>{
      // this.times = res
      this.minDate = new Date(res.data.min_date)
      this.maxDate = new Date(res.data.max_date)
      this.getMinDate  = this.minDate;
      this.getCurrentDate(new Date(res.data.min_date))
      if (res.data?.date_lock) {
        res.data?.date_lock.forEach((e:string) => {
          this.invalidDates.push(new Date(e))
        });
      }
    })
  }

  getMinDate!:Date;
  getCurrentDate(e:Date){
    this.minDate = this.getMinDate;

    const online_appointments = this.Emirate_appointments[0]?.online_appointments
    this.SelectedAppointment = online_appointments.filter( res => {
      return res?.date == e.toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' )
    })
    this.msg = {
      email: this.ClinicForm.value?.email,
      emirate: this.Emirate_appointments[0]?.name,
      mobile: this.ClinicForm.value?.mobile,
      name: this.ClinicForm.value?.name,
      whatsApp: this.ClinicForm.value?.whatsApp,
      date:this.SelectedAppointment[0]?.date,
      day:this.SelectedAppointment[0]?.day,
      max_people:Number(this.max_people),
    }
    this.isSelectedDate = true;
  }

  time_id!:number;
  getCurrentTime(id:number){
    this.isSelectedTime.emit(true);
    this.time_id = id;
    this.getSubInfo();
  }

  getSubInfo(){
    this.SubInfo.emit({
      name: this.msg.name,
      email: this.msg.email,
      mobile: this.msg.mobile,
      max_people: Number(this.max_people),
      time_id: this.time_id,
      date: this.msg.date,
      area_id: this.ClinicForm.value?.area,
      subscription_from: "web",
      emirate_id: this.Emirate_appointments[0]?.id,
      day: this.msg.day,
    })
  }

  getPrice(client_Number:Number = 1){
    this.price = Number(this.Emirate_appointments[0]?.inbody_price) * Number(client_Number);
    this.max_people = this.people_count.nativeElement.value
    this.getSubInfo();
  }

}
