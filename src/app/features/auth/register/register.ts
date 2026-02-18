import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models/auth/register-request.model';
import { GoBackButton } from '../../../shared/components/go-back-button/go-back-button';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,RouterLink,GoBackButton],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]] 
  });

  errorMessage = '';

  onSubmit(): void {
    if(this.registerForm.valid){

      const credentials: RegisterRequest = {
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.auth.register(credentials).subscribe({
        next: (response) => {
          this.auth.saveToken(response.token);
          this.router.navigate(['/']);
        },
      
        error: (err) => {
          this.errorMessage = 'Credentials incorrect or server is not joinable.';
          console.error('Registration error:', err);
        }
      });

    }
  }

}
