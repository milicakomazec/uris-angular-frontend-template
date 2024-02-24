import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [CommonModule],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  toggleSideNav: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleSideNavigation() {
    this.toggleSideNav = !this.toggleSideNav;
  }

  closeMenu(path: string) {
    this.toggleSideNav = false;
    this.router.navigate([path]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
