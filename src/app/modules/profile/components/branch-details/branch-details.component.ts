import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IBranchDetailsResponse, IBranchResponse } from 'src/app/shared/interfaces/HttpResponse';
import { IBranchDetails } from 'src/app/shared/interfaces/location';
import { BranchesService } from 'src/app/shared/services/branches/branches.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'app-branch-details',
    templateUrl: './branch-details.component.html',
    styleUrls: ['./branch-details.component.scss'],
})
export class BranchDetailsComponent implements OnInit {
    Branches: IBranchDetails[] = [];
    emirateName:string = '';
    @Input() branchId!:number;

    constructor(
        private _BranchesService: BranchesService,
        private _SharedService: SharedService,
        private _I18nService: I18nService,
        public translate: TranslateService
    )   {
            this._I18nService.saveCurrentLang(this.translate)
        }

    ngOnInit(): void {
        this.getEmirates(this.branchId);
        this.getBranches(this.branchId);
    }

    hover(
        phone: HTMLElement,
        phone2: HTMLElement,
        branch: HTMLElement,
        location: HTMLElement,
        clock: HTMLElement
    ) {
        phone.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/phone_white.png'
        );
        phone2.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/phone_white_x5.png'
        );
        branch.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/branch_white.png'
        );
        location.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/location_white.png'
        );
        clock.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/clock_white.png'
        );
    }

    unhover(
        phone: HTMLElement,
        phone2: HTMLElement,
        branch: HTMLElement,
        location: HTMLElement,
        clock: HTMLElement
    ) {
        phone.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/phone_green.png'
        );
        phone2.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/phone_green_x5.png'
        );
        branch.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/branch_green.png'
        );
        location.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/location_green.png'
        );
        clock.setAttribute(
            'src',
            '../../../../../assets/images/abu-dhabi/clock_green.png'
        );
    }

    getBranches(emirate_id:number) {
        let id: number = this._SharedService.getFormData({emirate_id: emirate_id}) as any as number;
        this._BranchesService.getBranches(id).subscribe((res: IBranchDetailsResponse) => {
            this.Branches = [...res.data];
            if (this.translate.currentLang == 'ar') {
                this.Branches.map(b =>{
                    b.description = b.description_ar
                    b.name = b.name_ar
                })
            }
        });
    }

    getEmirates(id:number){
        this._BranchesService.getEmirates().subscribe((res:IBranchResponse)=>{
            if (this.translate.currentLang == 'ar') {
                let e = res.data.find(emirate=>emirate.id == Number(id))?.name_ar;
                if (e) {
                    this.emirateName = e;
                }
            }
            else{
                let e = res.data.find(emirate=>emirate.id == Number(id))?.name;
                if (e) {
                    this.emirateName = e;
                }
            }
        })
    }
}
