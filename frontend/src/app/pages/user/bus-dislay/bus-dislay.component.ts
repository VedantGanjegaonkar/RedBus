// templateUrl: './bus-dislay.component.html',

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from 'src/app/core/services/bus.service';
import { ProductQueryParams } from 'src/app/core/interfaces/interfaces';

@Component({
  selector: 'app-bus-dislay',
  templateUrl: './bus-dislay.component.html',
  styleUrls: ['./bus-dislay.component.scss']
})
export class BusDislayComponent implements OnInit {
  bus: any;
  bookingForm!: FormGroup;
  queryParams: ProductQueryParams = {};

  from!:number;
  to!:number;

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const busId = params['id'];
      this.queryParams = {
        from: params['from'],
        
        to: params['to'],
        date: params['date']
      };
      this.loadBus(busId);
    });
    this.initBookingForm();
    
  }

  // fromToload(startStop:string,endStop:string){

  // this.from = this.bus.routeDetails.stops.findIndex(stop => stop.stop_name === startStop);
  // this.to = this.bus.routeDetails.stops.findIndex(stop => stop.stop_name === endStop);

  // }

  loadBus(id: string): void {
    this.busService.getBusById(id).subscribe(
      (data) => {
        console.log("bus data :",data);
        
        this.bus = data[0];
        this.from = data[0].routeDetails.stops.findIndex((stop: { stop_name: string | undefined; }) => stop.stop_name === this.queryParams.from);
        this.to = data[0].routeDetails.stops.findIndex((stop: { stop_name: string | undefined; }) => stop.stop_name === this.queryParams.to);
        
      },
      (error) => {
        console.error('Error fetching bus details:', error);
      }
    );
  }
  initBookingForm(): void {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    this.bookingForm = this.fb.group({
      startStop: [this.queryParams.from, Validators.required],
      endStop: [this.queryParams.to, Validators.required],
      travelDate: [formattedDate, Validators.required],
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
        
        if ((from > start && from < end) || (to > start && to < end) || (from <= start && to >= end)) {
          flag= false;
        }
      }
    
  
  return flag
  }

  // getSeatColor(status: string): string {
  //   return status === 'available' ? 'bg-success' : 'bg-danger';
  // }

  getSeatColor(seat:number[][]): string {    //seat => [[0,2],[5,6]] or [] 

    if(this.isSeatAvailableFromTo(seat,this.from,this.to)){
      
      
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
