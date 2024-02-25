import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth/auth-guard-service';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BacklogComponent } from './pages/backlog/backlog.component';

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
        path: 'backlog/:page',
        component: BacklogComponent,
      },
      {
        path: 'backlog',
        component: BacklogComponent,
      },

      {
        path: 'board',
        component: DashboardComponent,
      },
      {
        path: 'profile',
        component: UserProfileComponent,
      },
    ],
  },
];
