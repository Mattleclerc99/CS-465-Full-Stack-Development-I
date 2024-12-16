import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    // Retrieve stashed trip code
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something went wrong; couldn't find where tripCode was stashed!");
      this.router.navigate(['']);

      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode:', tripCode);

    // Initialize the form with validators
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ["", Validators.required],
      length: ["", Validators.required],
      start: ["", Validators.required],
      resort: ["", Validators.required],
      perPerson: ["", Validators.required],
      image: ["", Validators.required],
      description: ["", Validators.required]
    });

    // Fetch trip data by code
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;
        // Populate form fields with fetched data
        this.editForm.patchValue(value[0]);
        if (!value) {
          this.message = 'No Trip Retrieved!';
        } else {
          this.message = `Trip: ${tripCode} retrieved successfully.`;
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    console.log('Form submitted:', this.editForm.value); // Debugging: Log form values
    console.log('Form valid:', this.editForm.valid); // Debugging: Log form validity
  
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: any) => {
          console.log('Trip updated successfully:', value); // Debugging
          alert('Trip saved successfully!');
          this.router.navigate(['']); // Redirect
        },
        error: (error: any) => {
          console.error('Error updating trip:', error); // Debugging
          alert('Failed to save trip.');
        }
      });
    } else {
      console.log('Form invalid. Please check required fields.');
    }
  }
  
  public onDeleteTrip(): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      const tripCode = this.editForm.value.code; // Get the trip code
      console.log('Attempting to delete trip with code:', tripCode);
  
      this.tripDataService.deleteTrip(tripCode).subscribe({
        next: () => {
          console.log('Trip deleted successfully');
          alert('Trip deleted successfully!');
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Error deleting trip:', error);
          alert('Failed to delete trip.');
        }
      });
    }
  }
  
  

  // Getter to access form fields
  get f() {
    return this.editForm.controls;
  }
}
