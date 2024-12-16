import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule], 
})
export class LoginComponent {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public onLoginSubmit(): void {
    console.log('Login form submitted'); // Debugging
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      console.log('Validation failed:', this.credentials); // Debugging
    } else {
      this.doLogin();
    }
  }
  

  private doLogin(): void {
    this.authenticationService
      .login(this.credentials)
      .then(() => this.router.navigateByUrl('/'))
      .catch((message) => (this.formError = message));
  }
}
