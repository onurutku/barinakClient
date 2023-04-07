import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function passwordMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { error: true };
    }
    if (control.value != control.parent?.get('password')?.value) {
      return { error: true };
    }
    return null;
  };
}
