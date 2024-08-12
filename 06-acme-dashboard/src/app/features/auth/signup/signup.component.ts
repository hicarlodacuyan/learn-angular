import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService
        .signup(email, password)
        .then((success) => {
          console.log('Signup success', success);
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error('Signup error', error);
        });
    }
  }
}
