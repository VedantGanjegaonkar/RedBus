import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import {  } from '../admin/bus-create/bus-create.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BusDislayComponent } from './bus-dislay/bus-dislay.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';


const routes: Routes = [{ path: '', component: UserComponent },
  { path: 'buses', component: BusListComponent },
  { path: 'bus/:id', component: BusDislayComponent },
  { path: 'my-bookings', component: UserBookingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
