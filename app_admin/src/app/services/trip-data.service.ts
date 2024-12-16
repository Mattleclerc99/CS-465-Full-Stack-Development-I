import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BROWSER_STORAGE } from "../storage";
import { AuthResponse } from '../models/authresponse';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root' // Ensure this service is globally available
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private tripUrl = `${this.apiBaseUrl}/trips`;

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Fetch all trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new trip
  addTrip(tripData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/trips`; 
    const token = this.storage.getItem('travlr-token'); 
    const headers = { Authorization: `Bearer ${token}` }; 
    return this.http.post<any>(url, tripData, { headers }).pipe(
      catchError(this.handleError) 
    );
  }
  
  
  // Fetch a single trip by its code
  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.tripUrl}/${tripCode}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update a trip
  updateTrip(formData: Trip): Observable<Trip> {
    const url = `${this.tripUrl}/${formData.code}`;
    const token = this.storage.getItem('travlr-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Trip>(url, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a trip
deleteTrip(code: string): Observable<void> {
  const url = `${this.tripUrl}/${code}`; 
  const token = this.storage.getItem('travlr-token'); 
  const headers = { Authorization: `Bearer ${token}` }; 
  return this.http.delete<void>(url, { headers }).pipe(
    catchError(this.handleError) 
  );
}


  // Handles errors for all HTTP requests
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error); // Log the error for debugging
    return Promise.reject(error.message || error);
  }

  // Log in a user
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  // Register a new user
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  // Helper method to make authentication API calls (login/register)
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url = `${this.apiBaseUrl}/${urlPath}`; 
    return lastValueFrom(
      this.http.post<AuthResponse>(url, user).pipe(
        catchError(this.handleError)
      )
    );
  }
}
