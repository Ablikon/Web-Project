import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'storekeeper' as 'admin' | 'storekeeper'
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Basic validation
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => {
        // Registration successful, the auth service will handle login after registration
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        
        if (err.error && typeof err.error === 'object') {
          // Extract the first error message from the response
          const firstError = Object.values(err.error)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            this.error = firstError[0];
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
  }
} 