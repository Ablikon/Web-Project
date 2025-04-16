import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="user-form-container">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit User' : 'Create User' }}</h1>
      </div>
      
      <div class="form-container">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" formControlName="username" class="form-control" 
              [readonly]="isEditMode"/>
            <div class="error" *ngIf="submitted && f['username'].errors">
              <span *ngIf="f['username'].errors?.['required']">Username is required</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" class="form-control" />
            <div class="error" *ngIf="submitted && f['email'].errors">
              <span *ngIf="f['email'].errors?.['required']">Email is required</span>
              <span *ngIf="f['email'].errors?.['email']">Enter a valid email</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input type="text" id="first_name" formControlName="first_name" class="form-control" />
            </div>
            
            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input type="text" id="last_name" formControlName="last_name" class="form-control" />
            </div>
          </div>
          
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" formControlName="role" class="form-control">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="storekeeper">Storekeeper</option>
            </select>
            <div class="error" *ngIf="submitted && f['role'].errors">
              <span *ngIf="f['role'].errors?.['required']">Role is required</span>
            </div>
          </div>
          
          <div class="form-group" *ngIf="!isEditMode">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" class="form-control" />
            <div class="error" *ngIf="submitted && f['password'].errors">
              <span *ngIf="f['password'].errors?.['required']">Password is required</span>
              <span *ngIf="f['password'].errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn secondary" routerLink="/users">Cancel</button>
            <button type="submit" class="btn primary">{{ isEditMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .user-form-container {
      padding: 20px;
    }
    
    .header {
      margin-bottom: 20px;
    }
    
    .form-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 600px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-row {
      display: flex;
      gap: 20px;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }
    
    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      border: none;
    }
    
    .primary {
      background-color: #1976d2;
      color: white;
    }
    
    .secondary {
      background-color: #e0e0e0;
      color: #333;
    }
  `
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      role: ['storekeeper', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
      
      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }
  
  loadUser(id: number): void {
    this.authService.getUser(id).subscribe(
      user => {
        // Remove password field for edit mode
        const { password, ...userData } = this.userForm.value;
        
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: user.role
        });
      }
    );
  }
  
  // Getter for easy access to form fields
  get f() { 
    return this.userForm.controls; 
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      return;
    }
    
    if (this.isEditMode && this.userId) {
      // For edit, we don't send the password if it's empty
      const userData = { ...this.userForm.value };
      if (!userData.password) {
        delete userData.password;
      }
      
      this.authService.updateUser(this.userId, userData).subscribe(
        () => {
          this.router.navigate(['/users']);
        }
      );
    } else {
      this.authService.register(this.userForm.value).subscribe(
        () => {
          this.router.navigate(['/users']);
        }
      );
    }
  }
} 