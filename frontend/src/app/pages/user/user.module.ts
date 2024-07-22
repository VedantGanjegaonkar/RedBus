import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BusDislayComponent } from './bus-dislay/bus-dislay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';


@NgModule({
  declarations: [
    UserComponent,
    BusListComponent,
    BusDislayComponent,
    BookingDetailsComponent,
    UserBookingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
  
  ]
})
export class UserModule { }
