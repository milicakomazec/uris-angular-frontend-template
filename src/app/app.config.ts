import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth/auth-service';

interface AppConfig extends ApplicationConfig {
  AuthService: typeof AuthService;
}
export const appConfig: AppConfig = {
  providers: [provideRouter(routes)],
  AuthService,
};
