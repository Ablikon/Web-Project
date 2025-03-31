import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerData.password !== this.registerData.passwordConfirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authService.register({
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = 'Registration failed. Please try again.';
      }
    });
  }
} 