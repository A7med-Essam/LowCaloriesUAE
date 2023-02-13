import { ElementRef, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    constructor() { }
    uaeDate!: Date;

    hover(element: HTMLElement, src: string) {
        element.children[0].children[0].setAttribute('src', src);
    }

    unhover(element: HTMLElement, src: string) {
        element.children[0].children[0].setAttribute('src', src);
    }

    getFormData(object: any) {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
        return formData;
    }

    getAllSiblings(element: any, parent: any) {
        const children = [...parent.children];
        return children.filter(child => child !== element);
    }

    checkAllWeek(e: HTMLElement, ProgramDetailsForm?: any) {
        let AllSiblings: HTMLElement[] = this.getAllSiblings(e.parentElement, e.parentElement?.parentElement)
        if (e.classList.contains("active")) {
            e.classList.remove("active")
            AllSiblings.forEach((e: HTMLElement) => {
                if (!e.children[0].classList.contains("zindex_minus")) {
                    e.children[0].classList.remove("active")
                }
            });
            ProgramDetailsForm?.get('CheckDays')?.setValue(false);
        }
        else {
            e.classList.add("active")
            AllSiblings.forEach((e: HTMLElement) => {
                e.children[0].classList.add("active")
            });
            ProgramDetailsForm?.get('CheckDays')?.setValue(true);
        }
    }

    checkDays(e: HTMLElement, AllWeek: ElementRef, ProgramDetailsForm: FormGroup = new FormGroup({})) {
        e.classList.toggle("active");
        const siblings = this.getAllSiblings(e.parentElement, e.parentElement?.parentElement)
        if (e.classList.contains("active") || siblings[0].children[0].classList.contains("active")
            || siblings[1].children[0].classList.contains("active") || siblings[2].children[0].classList.contains("active")
            || siblings[3].children[0].classList.contains("active") || siblings[4].children[0].classList.contains("active")
            || siblings[5].children[0].classList.contains("active")) {
            ProgramDetailsForm?.get('CheckDays')?.setValue(true);
        }
        else {
            ProgramDetailsForm?.get('CheckDays')?.setValue(false);
            AllWeek.nativeElement.classList.remove("active")
        }
    }

    onSelectedDate(SelectedDate: Date, deliveredDays: HTMLElement) {
        let Days = deliveredDays.children;
        for (let i = 0; i < Days.length; i++) {
            deliveredDays.children[i].children[0].classList.remove("active")
            deliveredDays.children[i].children[0].classList.remove("zindex_minus")
            if (Number(deliveredDays.children[i].children[0].getAttribute("day")) == SelectedDate.getDay()) {
                deliveredDays.children[i].children[0].classList.add("active")
                deliveredDays.children[i].children[0].classList.add("zindex_minus")
            }
        }
    }

    getUaeTime() {
        let minDateValue: Date = new Date();
        let utc = minDateValue.getTime() + (minDateValue.getTimezoneOffset() * 60000);
        this.uaeDate = new Date(utc + (3600000 * 4)); // 4 is the offset of UAE
        this.uaeDate.setDate(this.uaeDate.getDate() + 2);
        return this.uaeDate;
    }

    // cut code to shared service
    getDayNumber(Day_name: string | undefined | null) {
        switch (Day_name) {
            case 'SATURDAY':
                return 6
            case 'SUNDAY':
                return 0
            case 'MONDAY':
                return 1
            case 'TUSEDAY':
                return 2
            case 'WEDNESDAY':
                return 3
            case 'THURSDAY':
                return 4
            default:
                return 5
        }
    }

    getDayName(Day_number: string | undefined | null) {
        switch (Day_number) {
            case '6':
                return 'SATURDAY'
            case '5':
                return 'FRIDAY'
            case '1':
                return 'MONDAY'
            case '2':
                return 'TUSEDAY'
            case '3':
                return 'WEDNESDAY'
            case '4':
                return 'THURSDAY'
            default:
                return 'SUNDAY'
        }
    }

    getDayNameAr(Day_number: string | undefined | null) {
        switch (Day_number) {
            case '6':
                return 'السبت'
            case '5':
                return 'الجمعه'
            case '1':
                return 'الأثنين'
            case '2':
                return 'الثلاثاء'
            case '3':
                return 'الأربعاء'
            case '4':
                return 'الخميس'
            default:
                return 'الأحد'
        }
    }

    toggleCategories(e: Event) {
        let el = e.target as Element;
        el.classList.add("active");
        const Siblings = this.getAllSiblings(el.parentElement, el.parentElement?.parentElement);
        Siblings.forEach((e: HTMLElement) => {
            e.children[0].classList.remove("active");
        });
    }
}
