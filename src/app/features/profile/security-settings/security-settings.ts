import { Component, input, output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './security-settings.html',
  styleUrl: './security-settings.css',
})
export class SecuritySettings {

  private fb = inject(FormBuilder);

  isChanging = input<boolean>(false);
  successMsg = input<string | null>(null);
  errorMsg = input<string | null>(null);

  onSubmit = output<any>();

  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  submit() {
    if (this.passwordForm.valid) {
      this.onSubmit.emit(this.passwordForm.value);
      this.passwordForm.reset();
    }
  }
}
