import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule], 
})
export class NavbarComponent {
  constructor(private authenticationService: AuthenticationService) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onLogout(): void {
    this.authenticationService.logout();
  }
}
