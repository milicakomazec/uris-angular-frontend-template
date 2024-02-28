import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [CommonModule, RouterOutlet],
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
    this.router.navigate([path]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
