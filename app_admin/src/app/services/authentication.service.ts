import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { TripDataService } from '../services/trip-data.service';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User): Promise<any> {
    return this.tripDataService.login(user).then((authResp: AuthResponse) => {
      console.log('Token received from server:', authResp.token); // Debug
      this.saveToken(authResp.token); // Save token to local storage
      console.log('Token saved to storage:', this.getToken()); // Confirm saved token
    });
  }
  
  public register(user: User): Promise<any> {
    return this
      .tripDataService
      .register(user)
      .then((authResp: AuthResponse) =>
        this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
    window.location.href = '/login'; 
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000); // Check expiration
      } catch (err) {
        console.error('Invalid token:', err);
        this.logout(); // Logout on invalid token
        return false;
      }
    } else {
      return false;
    }
  }
  

  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
        const token: string = this.getToken();
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
    }
    return null;
  }
}