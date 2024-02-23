import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('containerWrapper') containerWrapper!: ElementRef;
  loginObj: Login;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loginObj = new Login();
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
    this.http
      .post<LoginResponse>(
        'https://app.microenv.com/backend/key/1b40b895e89f87f922b2b3/rest/api/login',
        this.loginObj
      )
      .subscribe(res => {
        if (res.result) {
          alert('Login success');
          this.router.navigateByUrl('/dashboard');
        } else {
          alert(res.message);
        }
      });
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

export class Login {
  EmailId: string;
  Password: string;
  constructor() {
    this.EmailId = '';
    this.Password = '';
  }
}
