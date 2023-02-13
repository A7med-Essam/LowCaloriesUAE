import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Header, Footer } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ConfirmationService } from 'primeng/api';
import { SkeletonModule } from "primeng/skeleton";


const APP_PRIMENG_MODULE = [
	SharedModule,
	DialogModule,
	DropdownModule,
	CalendarModule,
	InputTextModule,
	PasswordModule, 
	ConfirmDialogModule,
	SkeletonModule
];


@NgModule({
	declarations: [],
	imports: [
		CommonModule,
	],
	exports: [
		APP_PRIMENG_MODULE
	],
	providers: [ConfirmationService],
})
export class PrimeNGModule { }
