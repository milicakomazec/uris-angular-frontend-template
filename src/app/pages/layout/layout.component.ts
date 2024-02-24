import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [CommonModule],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  toggleSideNav: boolean = false;

  constructor(private router: Router) {}

  toggleSideNavigation() {
    this.toggleSideNav = !this.toggleSideNav;
  }

  closeMenu() {
    this.toggleSideNav = false;
  }

  logout() {
    this.router.navigateByUrl('/login');
  }
}
