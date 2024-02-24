import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  toggleSideNav: boolean = false;

  constructor() {}

  toggleSideNavigation() {
    this.toggleSideNav = !this.toggleSideNav;
  }

  closeMenu() {
    this.toggleSideNav = false;
  }
}
