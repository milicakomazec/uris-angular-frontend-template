import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

interface LoginResponse {
  status: number;
  message: string;
  result: {
    token: string;
    username: string;
  };
}

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
  loginForm: FormGroup; // Define FormGroup
  constructor(
    private http: HttpClient,
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
      this.http
        .post<LoginResponse>(
          'https://app.microenv.com/backend/key/1b40b895e89f87f922b2b3/rest/api/login',
          this.loginForm.value
        )
        .subscribe(res => {
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
