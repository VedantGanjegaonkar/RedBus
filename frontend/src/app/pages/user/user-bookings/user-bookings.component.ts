// user-bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private busService: BusService) { }

  ngOnInit(): void {
    this.loadUserBookings();
    
  }

  loadUserBookings(): void {
    this.loading = true;
    this.busService.getBookingDetails().subscribe(
      (data) => {
       console.log("data from response:",data);
       
        this.bookings = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching user bookings:', error);
        this.error = 'Failed to load bookings. Please try again later.';
        this.loading = false;
      }
    );
  }
}