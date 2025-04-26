import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-warehouse-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent implements OnInit {
  activeRoute: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set active route based on current URL
    this.activeRoute = this.router.url.split('/')[1] || 'products';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
