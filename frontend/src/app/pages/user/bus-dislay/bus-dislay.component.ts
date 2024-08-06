// templateUrl: './bus-dislay.component.html',

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-bus-dislay',
  templateUrl: './bus-dislay.component.html',
  styleUrls: ['./bus-dislay.component.scss']
})
export class BusDislayComponent implements OnInit {
  bus: any;
  
  bookingForm!: FormGroup;
  from!:2
  to!:4

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const busId = params['id'];
      this.loadBus(busId);
    });
    this.initBookingForm();
  }

  loadBus(id: string): void {
    this.busService.getBusById(id).subscribe(
      (data) => {
        this.bus = data[0];
      },
      (error) => {
        console.error('Error fetching bus details:', error);
      }
    );
  }
  initBookingForm(): void {
    this.bookingForm = this.fb.group({
      startStop: ['', Validators.required],
      endStop: ['', Validators.required],
      travelDate: ['', Validators.required],
      passengerDetails: this.fb.array([])
    });
    this.addPassenger(); // Add one passenger by default
  }
  get passengerDetails(): FormArray {
    return this.bookingForm.get('passengerDetails') as FormArray;
  }

  addPassenger(): void {
    const passenger = this.fb.group({
      seat: ['', Validators.required],
      gender: ['', Validators.required]
    });
    this.passengerDetails.push(passenger);
  }

  removePassenger(index: number): void {
    this.passengerDetails.removeAt(index);
  }
   isSeatAvailableFromTo(seat: number[][], from: number, to: number):boolean {
    let flag:boolean=true

    // if (seat.length === 0) {
    //   flag= true;
    // }
  
      
      for (let i = 0; i < seat.length; i++) {
        const [start, end] = seat[i];
        
        if (!(to < start || from > end)) {
          flag= false;
        }
      }
    
  
  return flag
  }

  // getSeatColor(status: string): string {
  //   return status === 'available' ? 'bg-success' : 'bg-danger';
  // }

  getSeatColor(seat:number[][]): string {    //seat => [[0,2],[5,6]] or [] 

    if(this.isSeatAvailableFromTo(seat,2,5)){
      
      return 'bg-success'
    }else{
      return 'bg-danger'
    }
  }

  getSeatText(status: string): string {
    return status === 'available' ? 'A' : 'B';
  }

  getSeatNumber(sectionIndex: number, rowIndex: number, seatIndex: number): string {
    return `${sectionIndex}${rowIndex}${seatIndex}`;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const bookingData = {
        busId: this.bus._id,
        routeId: this.bus.routeDetails._id,
        ...this.bookingForm.value,
        seats: this.passengerDetails.value.map((passenger: any) => passenger.seat)
      };
      console.log('Booking data:', bookingData);

      this.busService.bookApi(bookingData).subscribe(
        (response) => {
          console.log('booked successfully:', response.message);
         alert(response.message)
        },
        (error) => {
          console.error('Error creating bus:', error);
        }
      );
      
    } else {
      console.log('Form is invalid');
    }
  }

  onSeatClick(seatNumber: string): void {
    console.log(`Clicked seat number: ${seatNumber}`);
    // You can add more logic here, such as selecting the seat or showing a modal
  }



}
