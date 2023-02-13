import { FormGroup } from "@angular/forms";

export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl?.errors && !matchingControl?.errors.confirmedValidator) {
            return;
        }
        if (control?.value !== matchingControl?.value) {
            return matchingControl?.setErrors({ confirmedValidator: true });
        } 
        else {
            return matchingControl?.setErrors(null);
        }
    }
}