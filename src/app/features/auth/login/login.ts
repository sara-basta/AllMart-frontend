import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/auth/login-request.model';
import { GoBackButton } from '../../../shared/components/go-back-button/go-back-button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,GoBackButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth); // auth service
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]] 
  });

  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.valid) {

      const credentials: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      // send the data to the auth service
      this.auth.login(credentials).subscribe({
        next: (response) => {
          // if OK (200) -> save token
          this.auth.saveToken(response.token);
          // and redirect
          this.router.navigate(['/']); 
        },
        error: (err) => {
          // if NOT (401, 403) -> display error message
          this.errorMessage = 'Credentials incorrect or server is not joinable.';
          console.error('Connexion error:', err);
        }
      });
    }
  }
}
