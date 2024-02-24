import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('containerWrapper') containerWrapper!: ElementRef;
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.addEventListener(
      'click',
      this.handleInputClick.bind(this)
    );
    this.passwordInput.nativeElement.addEventListener(
      'click',
      this.handleInputClick.bind(this)
    );
  }

  handleInputClick(event: MouseEvent) {
    this.toggleAnimationPause(true);
    event.stopPropagation();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(res => {
        if (res.result) {
          this.router.navigateByUrl('/dashboard');
        } else {
          alert(res.message);
        }
      });
    } else {
      alert('Please enter valid credentials');
    }
  }

  toggleAnimationPause(pause: boolean) {
    const containerWrapper = this.containerWrapper.nativeElement;
    if (pause) {
      containerWrapper.classList.add('pause-animation');
    } else {
      containerWrapper.classList.remove('pause-animation');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (
      !this.emailInput.nativeElement.contains(clickedElement) &&
      !this.passwordInput.nativeElement.contains(clickedElement)
    ) {
      this.toggleAnimationPause(false);
    }
  }
}
