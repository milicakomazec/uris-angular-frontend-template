import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './auth/auth-guard-service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'backlog',
        component: DashboardComponent,
      },
      {
        path: 'board',
        component: DashboardComponent,
      },
      {
        path: 'profile',
        component: DashboardComponent,
      },
    ],
  },
];
