import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { Trip } from '../models/trip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css']
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public addTrip(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['add-trip']);
    } else {
      console.error('User is not logged in.');
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  private loadTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (trips: Trip[]) => {
        this.trips = trips;
        this.message = trips.length
          ? `There are ${trips.length} trips available.`
          : 'No trips available.';
      },
      error: (err) => {
        console.error('Failed to load trips:', err);
      }
    });
  }

  ngOnInit(): void {
    console.log('TripListingComponent initialized'); // Debugging
    this.loadTrips();
  }
}
